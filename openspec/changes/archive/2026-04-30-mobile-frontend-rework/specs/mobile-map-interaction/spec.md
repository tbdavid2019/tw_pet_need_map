## ADDED Requirements

### Requirement: Disable InfoWindow on Mobile
The system SHALL NOT trigger Google Maps default InfoWindow behavior for markers clicked on mobile devices, passing the selected data payload directly to the app state.

#### Scenario: Interacting with Map Pins on Mobile
- **WHEN** the user is on a mobile viewport and touches a location marker
- **THEN** the system bypasses InfoWindow instantiation and updates the global `selectMarker` state.
