const { withAndroidManifest } = require("@expo/config-plugins");

const withAndroidRestrictions = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Ensure the tools namespace is available for using tools:replace
    if (!androidManifest.manifest.$["xmlns:tools"]) {
      androidManifest.manifest.$["xmlns:tools"] =
        "http://schemas.android.com/tools";
    }

    const mainApplication = androidManifest.manifest.application[0];
    let activities = mainApplication.activity;

    if (!activities) {
      activities = [];
      mainApplication.activity = activities;
    }

    const targetActivityName =
      "com.google.mlkit.vision.codescanner.internal.GmsBarcodeScanningDelegateActivity";
    const existingActivityIndex = activities.findIndex(
      (a) => a.$["android:name"] === targetActivityName,
    );

    // Define the activity node that overrides the library's declaration
    // We set screenOrientation to "fullSensor" (or "user") to allow rotation
    // and use tools:replace to force this value over the library's "PORTRAIT".
    const overrideActivity = {
      $: {
        "android:name": targetActivityName,
        "android:screenOrientation": "fullSensor",
        "tools:replace": "android:screenOrientation",
      },
    };

    if (existingActivityIndex !== -1) {
      // If it exists (e.g. from another plugin or manual add), update it
      activities[existingActivityIndex] = overrideActivity;
    } else {
      // Otherwise, add it so the merger sees it and applies the override
      activities.push(overrideActivity);
    }

    return config;
  });
};

module.exports = withAndroidRestrictions;
