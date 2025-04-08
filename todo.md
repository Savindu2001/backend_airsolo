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

