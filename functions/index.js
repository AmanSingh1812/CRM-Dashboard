// Import ES Modules
import * as functions from "firebase-functions";
import admin from "firebase-admin";

admin.initializeApp();

// Cloud Function to create users with roles
export const createUserWithRole = functions.https.onCall(
  async (data, context) => {
    // Only allow admins to call this
    const callerToken = context.auth?.token;
    if (!callerToken?.admin) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admins can create users."
      );
    }

    const { email, password, name, role } = data;

    if (!email || !password || !name || !role) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required fields"
      );
    }

    try {
      // 1️⃣ Create Auth user
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name,
      });

      // 2️⃣ Set custom claim
      const claims = role === "admin" ? { admin: true } : { salesperson: true };
      await admin.auth().setCustomUserClaims(userRecord.uid, claims);

      // 3️⃣ Add to Firestore
      await admin
        .firestore()
        .collection("salespersons")
        .doc(userRecord.uid)
        .set({
          uid: userRecord.uid,
          name,
          email,
          role,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          totalSales: 0,
        });

      return { success: true, uid: userRecord.uid };
    } catch (err) {
      throw new functions.https.HttpsError("internal", err.message);
    }
  }
);
