## MODIFIED Requirements

### Requirement: Define Mobile Breakpoint
The system MUST dynamically evaluate the `isMobile` state by observing window inner widths up to 768px (inclusive).

#### Scenario: Device screen resolution is 600px wide
- **WHEN** the browser window renders measuring 600px
- **THEN** `isMobile` evaluates to true, applying the Bottom Sheet and disabling Google Maps native InfoWindow popups.
