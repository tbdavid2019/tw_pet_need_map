## ADDED Requirements

### Requirement: Show Pet Info on Bottom Sheet
The system SHALL use `react-spring-bottom-sheet` to display a Bottom Sheet on mobile devices when a map marker is selected.

#### Scenario: Marker Selected on Mobile
- **WHEN** the user explores on a mobile device and selects a marker
- **THEN** the system opens a Bottom Sheet sliding up from the bottom showing the marker data.

### Requirement: Render UI native-like via z-index
The system SHALL display the bottom sheet above other map controls using CSS z-index overwrites.

#### Scenario: Bottom Sheet active over map controls
- **WHEN** the bottom sheet is opened
- **THEN** the container (`[data-rsbs-root]`) has a `z-index: 9999` preserving visual integrity.
