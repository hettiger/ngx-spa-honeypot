export class FormToken {

  constructor(
    protected value: null | string = null,
  ) {}

  /**
   * Returns the current form token value when present; falls back to an empty string;
   * sets form token value to `null` so it can be used only once.
   *
   * The empty string will tell the backend to respond with a new form token.
   * This allows to recover from errors. It makes the design simpler and more robust.
   */
  use(): string {
    const value = this.value;
    this.value = null;
    return value ?? '';
  }

  /**
   * Sets the form token value to the given `newTokenValue`
   *
   * Form token requests are always answered with a new form token that can be used on subsequent requests.
   */
  update(newTokenValue: null | string) {
    this.value = newTokenValue;
  }

}
