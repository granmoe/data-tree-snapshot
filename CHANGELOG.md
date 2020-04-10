# 2.0.0

So apparently I've been a little lax about maintaining a changelog in this repo...

## Breaking Changes

- All the export names changed from "print*" to "get*" (printTestIdTree -> getTestIdTree). I thought "print" was more descriptive, but in the context of how people use this library, "get" is sufficient and reads faster since it's more immediately understandable.

## New Features

- You can now configure you default test id attribute via `configure`, a la @testing-library/react. See the README or custom-test-id.test.js for a complete example.
