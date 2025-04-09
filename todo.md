# AirSolo Project - TODO List & Guide

## ✅ Quick Start

> To get started with development:

### Traveler App (Flutter)
1. Clone the repo
2. Run `flutter pub get`
3. Set Firebase configs for Android & iOS
4. Run `flutter run`

### Firebase Backend
- Firebase Auth
- Firestore (real-time DB)
- OpenAI API (for itinerary generation)
- Google Maps API (for location-based services)

### Web Admin Panel (Next.js/NestJS) — *(Future Phase)*
1. Setup Next.js frontend
2. Setup NestJS backend (Firebase-admin SDK + MongoDB)
3. Deploy to VPS or Firebase Functions

---

## 📌 TO DO

### Traveler App (Flutter)
- [ ] Booking flow integration
- [ ] Itinerary PDF viewer
- [ ] Payment gateway integration (partial and full)
- [ ] Display hotel/driver/vehicle info in “My Account”
- [ ] Extra activity add-on system
- [ ] Tour filters & search
- [ ] Guest hotel details input (for “Tour Only” option)

### Firebase Functions / Backend
- [ ] Booking status handler (unpaid → paid)
- [ ] Email sending logic (confirmation, invoice)
- [ ] AI-generated itinerary endpoint
- [ ] Secure role-based access for travelers/admins

### Admin Panel
- [ ] Booking dashboard
- [ ] Customer support chat
- [ ] Hotel/tour/driver/vehicle management
- [ ] Manual booking & invoice generation

### Web
- [ ] Tour listing with filters
- [ ] Dynamic itinerary & tour detail pages
- [ ] Tourist login & dashboard view

---

## 🚧 DOING

- [ ] Firebase backend integration for Traveler App
- [ ] "My Account" UI implementation in Flutter
- [ ] Setting up Google Maps & OpenAI API

---

## ✅ DONE

- [x] Traveler App UI design complete (Figma)
- [x] Firebase project initialized
- [x] Flutter SDK setup (`/Users/savindusenanayake/Developer/FlutterDev/flutter/bin`)
- [x] AirSolo Project report completed
- [x] Firebase Auth integration started

---

## 🗒️ Notes

- Admin panel development postponed for now
- Traveler app is the current focus
- Use test data for hotel and activity listings during development
- Separate VPS servers available for future CI/CD deployment
- Use `hello@ceylontripdeals.com` for tour communication
- Firebase Firestore used for main DB
- Custom subdomain logic might be needed in the future if expanding into SaaS

---

Absolutely yes! 💯 That's a **very good practice** for social login users.

### 🧠 Why should social users complete their profile?
Because Google/Facebook logins only return limited data:
- ✅ Name
- ✅ Email
- ✅ Profile photo

But your app needs more:
- NIC  
- Driving license ID  
- Country  
- Gender  
- Mobile number, etc.

So here's how you handle it:

---

### ✅ Step-by-Step Flow for Social Signup Users

#### 1. **User logs in via Google/Facebook**
- You authenticate via Firebase.
- Send the `idToken` to your backend.
- Check in MySQL if this Firebase UID already exists.

#### 2. **If new user:**
- ✅ Create a minimal record in MySQL (`email`, `name`, `profile_photo`, etc.).
- ❌ Do **not** mark `profile_completed = true` yet.
- ✅ Return a flag: `profileCompleted: false` to frontend.

#### 3. **Frontend checks this flag**
```js
if (!response.profileCompleted) {
   // Navigate user to a profile completion form
   Navigator.pushNamed(context, "/complete-profile");
}
```

#### 4. **User fills missing data (NIC, driving license, country, etc.)**
- Flutter sends a `PUT /api/user/complete-profile` request with data.

#### 5. **Backend saves it in MySQL**
- Update the existing user row.
- Set `profileCompleted = true`.

---

### 🔧 MySQL Table Example

You can add a column:
```sql
ALTER TABLE users ADD COLUMN profile_completed BOOLEAN DEFAULT false;
```

---

### 🧑‍💻 Backend: `completeUserProfile` Controller
```js
exports.completeUserProfile = async (req, res) => {
    const { uid, nic, driving_license_id, gender, country } = req.body;

    try {
        const user = await User.findByPk(uid);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.nic = nic;
        user.driving_license_id = driving_license_id;
        user.gender = gender;
        user.country = country;
        user.profile_completed = true;

        await user.save();

        return res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error completing profile:", error);
        return res.status(500).json({ message: "Failed to complete profile", error: error.message });
    }
};
```

---

### ✅ Final Summary

| Step | Action |
|------|--------|
| Social login success | Save basic data in MySQL |
| Check `profile_completed` | If false, show form |
| User submits full data | Save + mark profile as complete |
| Allow full app access | Only after completed profile |

---

Let me know if you want help creating the Flutter screen for profile completion or backend route. You're building this smart! 🔥