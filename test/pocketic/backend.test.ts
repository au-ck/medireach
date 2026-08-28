import { createIdentity, PocketIc } from "@dfinity/pic";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: _SERVICE;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
});

afterAll(async () => {
  await pic?.tearDown();
});

describe("MediReach backend public API", () => {
  it("answers an empty-state read instead of trapping", async () => {
    // The schema is a static string describing the OQL entities; it must not trap.
    await expect(actor.schema()).resolves.toBeTypeOf("string");
  });

  it("reports the caller role and admin status without trapping", async () => {
    // The default (anonymous) caller is a guest and never an admin.
    await expect(actor.getCallerUserRole()).resolves.toEqual({ guest: null });
    await expect(actor.isCallerAdmin()).resolves.toBe(false);
  });

  it("initializes access control and starts an identity sign-in without trapping", async () => {
    await expect(actor._initialize_access_control()).resolves.toBeNull();
    await expect(actor._internet_identity_sign_in_start()).resolves.toBeInstanceOf(Uint8Array);
  });

  it("round-trips a caller role assignment through the real canister", async () => {
    // `createIdentity` is re-exported by @dfinity/pic, so no direct import of
    // the @icp-sdk/core Principal class is needed from the lane directory.
    const caller = createIdentity("alice").getPrincipal();
    actor.setPrincipal(caller);

    // The caffeineai-authorization mixin requires the caller to be registered
    // before a role can be assigned: `assignCallerUserRole` traps with "User is
    // not registered" for an unregistered caller. `_initialize_access_control`
    // registers the caller, and the first registered caller becomes admin.
    await expect(actor._initialize_access_control()).resolves.toBeNull();

    await expect(actor.assignCallerUserRole(caller, { admin: null })).resolves.toBeNull();
    await expect(actor.getCallerUserRole()).resolves.toEqual({ admin: null });
    await expect(actor.isCallerAdmin()).resolves.toBe(true);
  });

  it("traps on an invalid OQL query instead of resolving", async () => {
    // An empty string is not a valid OQL query: the parser traps with
    // "OQL: invalid query — Unexpected EOF". The empty schema exposes no
    // entities, so there is no valid query that returns an empty result either
    // (any `start` entity is unknown and traps). The backend contract is to
    // trap on invalid input, so the call must reject rather than resolve.
    await expect(actor.execute("")).rejects.toThrow();
  });
});
