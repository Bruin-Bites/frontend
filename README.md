# Bruin Bites Frontend

## Development

1. Install dependencies to get all the libraries and necessary developer tools
```
npm install
```
2. Set the API URL for your backend  
Open `app.json` and add the following inside the `"expo"` object:
```
{
  "expo": {
    "...": "...",
    "extra": {
      "API_URL": "http://localhost:5050/api"
    }
  }
}
```
If you’re testing on a **real device**, replace `localhost` with your computer’s LAN IP (for example `http://192.168.1.10:5050/api`).

3. Start the Expo development server  
```
npm run start
```
4. Launch the app:
- Press **i** for iOS simulator  
- Press **a** for Android emulator  
- Or scan the QR code with the **Expo Go** app

The Expo Metro Bundler will serve your app at:

http://localhost:8081

## Project Structure
```
frontend/
├── App.js
├── app.json
├── assets/
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js  # Stack navigation between pages
│   ├── screens/
│   │   ├── HomeScreen.js    # UCLA-themed home with quick links
│   │   ├── MapScreen.js     # Cheap Eats map with search + filters
│   │   ├── RecipesScreen.js  # Budget recipes + AI chatbot
│   │   └── CommunityScreen.js  # Student posts with upvotes & tags
│   ├── services/
│   │   └── api.js           # Axios instance with baseURL from app.json
│   └── theme/
│       └── colors.js        # UCLA blue + gold palette
└── package.json
```
## Current Pages
<img width="357" height="744" alt="IMG_8145" src="https://github.com/user-attachments/assets/2cc10900-35d2-4d35-9ad7-ccf73c530163" />
<img width="357" height="744" alt="IMG_2348" src="https://github.com/user-attachments/assets/d9cd66c0-2120-4abc-b03e-42065ec4c63b" />
<img width="357" height="744" alt="IMG_9449" src="https://github.com/user-attachments/assets/84d9b079-78e6-46d7-9ba5-e0f8d28da364" />
<img width="357" height="744" alt="IMG_2412" src="https://github.com/user-attachments/assets/407cdfd7-4684-4b44-bd93-fd276e0d4191" />
<img width="357" height="744" alt="IMG_0309" src="https://github.com/user-attachments/assets/a400381b-262a-45de-b412-7f99728212dc" />

## Notes
- If you update `app.json`, clear the Expo cache:
```
npx expo start -c
```
- Make sure your backend is running before testing API calls.  
- Use `npx expo install <package>` instead of `npm install` to ensure dependency versions match your Expo SDK.

---

## Scripts
| Command | Description |
|----------|-------------|
| `npm run start` | Starts the Expo development server |
| `npx expo start -c` | Starts Expo with cache clear |
| `npm install` | Installs dependencies |

---
Dependencies worth noting
Installed via npm i / expo install:
```
@react-navigation/native, @react-navigation/native-stack,
react-native-screens, react-native-safe-area-context,
axios, expo-constants,
@expo/vector-icons, expo-linear-gradient
```

## Tech Stack
- **Expo (React Native)** – cross-platform mobile app framework  
- **React Navigation** – navigation stack and routing  
- **Axios** – HTTP client for API calls  
- **Expo Linear Gradient & Vector Icons** – styling and icons  
- **Safe Area Context** – handles iOS/Android screen safe zones
