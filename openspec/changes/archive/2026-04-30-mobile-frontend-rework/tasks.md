## 1. Setup and Dependencies

- [x] 1.1 Install `react-spring-bottom-sheet` and verify CSS import (`import "react-spring-bottom-sheet/dist/style.css";` in `index.js`).
- [x] 1.2 Update CSS settings for `[data-rsbs-root]` to have `z-index: 9999 !important` in the appropriate SCSS/CSS file.

## 2. Refactor Data Parsing (Data Optimization)

- [x] 2.1 Update `src/lib/dataParsers.js` (or equivalent file handling data parsing) to remove all `console.log` statements.
- [x] 2.2 In the parsing logic, apply Jitter logic: `const lat = baseLat + (Math.random() - 0.5) * 0.00015;` and `const lng = baseLng + (Math.random() - 0.5) * 0.00015;`.
- [x] 2.3 Normalize the `district` string by appending `區` if it's missing (e.g. `district.includes('區') ? district : district + '區'`).

## 3. Responsive Layout Adjustments

- [x] 3.1 Verify and update `src/component/PetAdoptionApp.js` `isWidthUnder` logic to ensure break points strictly utilize `768px` for triggering Mobile View.
- [ ] 3.2 Ensure any dynamic CSS shadow or absolute positioning specific to mobile info cards are removed to naturally fit inside the bottom sheet structure.

## 4. Map Interactivity Refactor

- [x] 4.1 Update `src/component/Map.js` onClick handlers for the `<Marker>`.
- [x] 4.2 Restrict native `InfoWindow` execution on `isMobile === true`. 
- [x] 4.3 Replace the marker interaction step in Mobile Mode: trigger setting component states (e.g., `setMapParameters({ selectMarker: data })`) rather than Map infoview events.

## 5. Implement react-spring-bottom-sheet UI

- [x] 5.1 In `src/component/PetAdoptionApp.js` (or similar component hosting the main view), import `BottomSheet` from `react-spring-bottom-sheet`.
- [x] 5.2 Integrate `BottomSheet` when `isMobile` is true and a marker is selected (`selectMarker` state is active).
- [x] 5.3 Render the selected `Card` data inside the `BottomSheet` content area overlaying the Map canvas.
