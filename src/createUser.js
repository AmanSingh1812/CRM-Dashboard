// createUser.js
import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync("serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function createSalesperson(email, password, name) {
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    await admin.firestore().collection("salespersons").doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      role: "salesperson",
      totalSales: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("User created:", userRecord.uid);
  } catch (err) {
    console.error("Error:", err);
  }
}

// Example usage
createSalesperson("sales1@example.com", "password123", "Sales One");
