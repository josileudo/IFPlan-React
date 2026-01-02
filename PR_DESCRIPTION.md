## PR Description

This PR introduces several major improvements to the IFPlan application, including robust form validation, a migration to AsyncStorage for better reliability, and a new CSV export feature for simulation results.

### Core Improvements

- **Form Validation**: Integrated `react-hook-form` and `Zod` for typed, robust validation of all simulation inputs.
- **State Persistence**: Migrated from `MMKV` to `@react-native-async-storage/async-storage` and implemented persistent storage for simulation data.
- **CSV Export**: Added `src/utils/exportCSV.ts` and integrated it into the `ResultScreen` to allow sharing results as CSV files.

### UI/UX & Configuration

- Updated project name, package identifier (`com.jrconsultoria.ifplan`), and assets (icons, splash screens).
- Optimized `Input`, `SliderComponent`, and `Card` components for better usability and platform consistency.
- Refined large title displays in headers across both iOS and Android.

### Bug Fixes & Optimization

- Resolved `NaN` results in calculations by ensuring default values (zero) and refining the calculation logic in `src/utils/formulas.ts`.
- Removed extraneous debug logs and simplified state management logic.
