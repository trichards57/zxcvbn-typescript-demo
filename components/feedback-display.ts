import { IZXCVBNResult } from "zxcvbn-typescript";

export class FeedbackDisplayElement extends HTMLElement {
  private _data: IZXCVBNResult["feedback"] | undefined;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const template = document.getElementById(
      "feedback-display-template"
    ) as HTMLTemplateElement;
    if (template && this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    this.updateDisplay();
  }

  set data(value: IZXCVBNResult["feedback"]) {
    this._data = value;

    this.updateDisplay();
  }

  private updateDisplay() {
    if (!this.shadowRoot) return;
    if (!this._data) return;
    // Handle warning
    const warningRow = this.shadowRoot.querySelector('[data-row="warning"]');
    const warningValue = this.shadowRoot.querySelector(
      '[data-field="warning"]'
    );
    if (this._data.warning) {
      warningRow?.removeAttribute("hidden");
      if (warningValue) {
        warningValue.textContent = this._data.warning;
      }
    } else {
      warningRow?.setAttribute("hidden", "");
    }

    // Handle suggestions
    const suggestionsRow = this.shadowRoot.querySelector(
      '[data-row="suggestions"]'
    );
    const suggestionsList = this.shadowRoot.querySelector(
      '[data-field="suggestions"]'
    );
    if (this._data.suggestions.length > 0) {
      suggestionsRow?.removeAttribute("hidden");
      if (suggestionsList) {
        suggestionsList.innerHTML = this._data.suggestions
          .map((s) => `- ${this.escapeHtml(s)} <br />`)
          .join("");
      }
    } else {
      suggestionsRow?.setAttribute("hidden", "");
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

customElements.define("feedback-display", FeedbackDisplayElement);
