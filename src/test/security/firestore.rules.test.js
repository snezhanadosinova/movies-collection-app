import { readFile } from "node:fs/promises";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

let testEnv;

beforeAll(async () => {
  const rules = await readFile(
    new URL("../../../firestore.rules", import.meta.url),
    "utf8",
  );

  testEnv = await initializeTestEnvironment({
    projectId: "demo-movies-collection",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules,
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();

  // Seed existing data without applying client security rules.
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "users", "alice"), {
      favorites: {
        550: true,
      },
    });
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

describe("Firestore user document rules", () => {
  it("allows the owner to read their document", async () => {
    const db = testEnv.authenticatedContext("alice").firestore();

    await assertSucceeds(getDoc(doc(db, "users", "alice")));
  });

  it("allows the owner to create their document", async () => {
    const db = testEnv.authenticatedContext("bob").firestore();

    await assertSucceeds(
      setDoc(doc(db, "users", "bob"), {
        favorites: { 100: true },
      }),
    );
  });

  it("allows adding and removing a favorite with merge writes", async () => {
    const db = testEnv.authenticatedContext("alice").firestore();
    const userRef = doc(db, "users", "alice");

    await assertSucceeds(
      setDoc(userRef, { favorites: { 100: true } }, { merge: true }),
    );

    await assertSucceeds(
      setDoc(userRef, { favorites: { 100: deleteField() } }, { merge: true }),
    );

    // Removing the last favorite must also be allowed.
    await assertSucceeds(
      setDoc(userRef, { favorites: { 550: deleteField() } }, { merge: true }),
    );
  });

  it("denies guest reads and writes", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const userRef = doc(db, "users", "alice");

    await assertFails(getDoc(userRef));

    await assertFails(setDoc(userRef, { favorites: {} }));
  });

  it("denies access to another user's document", async () => {
    const db = testEnv.authenticatedContext("bob").firestore();
    const userRef = doc(db, "users", "alice");

    await assertFails(getDoc(userRef));

    await assertFails(setDoc(userRef, { favorites: {} }));

    await assertFails(deleteDoc(userRef));
  });

  it("denies creating another user's document", async () => {
    const db = testEnv.authenticatedContext("bob").firestore();

    await assertFails(
      setDoc(doc(db, "users", "charlie"), {
        favorites: {},
      }),
    );
  });

  it("denies listing user documents", async () => {
    const db = testEnv.authenticatedContext("alice").firestore();

    await assertFails(getDocs(collection(db, "users")));
  });

  it("denies deleting the owner's document", async () => {
    const db = testEnv.authenticatedContext("alice").firestore();

    await assertFails(deleteDoc(doc(db, "users", "alice")));
  });

  it.each([
    ["missing favorites", {}],
    ["unexpected field", { favorites: {}, role: "admin" }],
    ["string favorites", { favorites: "invalid" }],
    ["array favorites", { favorites: [550] }],
    ["null favorites", { favorites: null }],
  ])("denies creating a document with %s", async (_label, data) => {
    const db = testEnv.authenticatedContext("bob").firestore();

    await assertFails(setDoc(doc(db, "users", "bob"), data));
  });

  it.each([
    ["missing favorites", {}],
    ["unexpected field", { favorites: {}, role: "admin" }],
    ["string favorites", { favorites: "invalid" }],
    ["array favorites", { favorites: [550] }],
    ["null favorites", { favorites: null }],
  ])("denies updating a document with %s", async (_label, data) => {
    const db = testEnv.authenticatedContext("alice").firestore();

    await assertFails(setDoc(doc(db, "users", "alice"), data));
  });
});
