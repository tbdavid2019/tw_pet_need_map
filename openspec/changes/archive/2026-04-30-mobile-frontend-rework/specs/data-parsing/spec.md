## MODIFIED Requirements

### Requirement: Normalize District Data and Clean Outputs
The system MUST ensure robust handling and cleaning of location properties parsing, such as appending the "區" character on missing districts, and SHALL enforce the absence of debug statements inside processing loops to maintain app performance.

#### Scenario: Data Source yields incomplete district suffix
- **WHEN** the parser digests raw items where `district` is populated merely as `中山`
- **THEN** the parsing logic outputs `中山區` internally formatted instead.

#### Scenario: Running tight parsing loops
- **WHEN** parsing executes over thousands of JSON entries
- **THEN** it completes operations quickly avoiding UI hanging by excluding `console.log` interactions.
