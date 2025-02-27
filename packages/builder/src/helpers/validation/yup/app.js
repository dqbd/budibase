import { string, mixed } from "yup"
import { APP_NAME_REGEX, APP_URL_REGEX } from "constants"

export const name = (validation, { apps, currentApp } = { apps: [] }) => {
  validation.addValidator(
    "name",
    string()
      .trim()
      .required("Your application must have a name")
      .matches(
        APP_NAME_REGEX,
        "App name must be letters, numbers and spaces only"
      )
      .test(
        "non-existing-app-name",
        "Another app with the same name already exists",
        value => {
          if (!value) {
            // exit early, above validator will fail
            return true
          }
          if (currentApp) {
            // filter out the current app if present
            apps = apps.filter(app => app.appId !== currentApp.appId)
          }
          return !apps
            .map(app => app.name)
            .some(appName => appName.toLowerCase() === value.toLowerCase())
        }
      )
  )
}

export const url = (validation, { apps, currentApp } = { apps: [] }) => {
  validation.addValidator(
    "url",
    string()
      .nullable()
      .matches(APP_URL_REGEX, "App URL must not contain spaces")
      .test(
        "non-existing-app-url",
        "Another app with the same URL already exists",
        value => {
          // url is nullable
          if (!value) {
            return true
          }
          if (currentApp) {
            // filter out the current app if present
            apps = apps.filter(app => app.appId !== currentApp.appId)
          }
          return !apps
            .map(app => app.url)
            .some(appUrl => appUrl?.toLowerCase() === value.toLowerCase())
        }
      )
      .test("valid-url", "Not a valid URL", value => {
        // url is nullable
        if (!value) {
          return true
        }
        // make it clear that this is a url path and cannot be a full url
        return (
          value.startsWith("/") &&
          !value.includes("http") &&
          !value.includes("www") &&
          !value.includes(".") &&
          value.length > 1 // just '/' is not valid
        )
      })
  )
}

export const file = (validation, { template } = {}) => {
  const templateToUse =
    template && Object.keys(template).length === 0 ? null : template
  validation.addValidator(
    "file",
    templateToUse?.fromFile
      ? mixed().required("Please choose a file to import")
      : null
  )
}
