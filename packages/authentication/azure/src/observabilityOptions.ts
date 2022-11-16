export interface ObservabilityOptions {
  getTracerInstrumentationName(): string;
}

export class ObservabilityOptionsImpl implements ObservabilityOptions {
  getTracerInstrumentationName(): string {
    return "@microsoft/kiota-authentication-azure";
  }
}
