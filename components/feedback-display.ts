export interface Feedback {
  warning?: string;
  suggestions: string[];
}

export class FeedbackDisplayElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const template = document.getElementById(
      "feedback-display-template",
    ) as HTMLTemplateElement;
    if (template && this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  set data(value: Feedback) {
    if (!this.shadowRoot) return;

    // Handle warning
    const warningRow = this.shadowRoot.querySelector('[data-row="warning"]');
    const warningValue = this.shadowRoot.querySelector(
      '[data-field="warning"]',
    );
    if (value.warning) {
      warningRow?.removeAttribute("hidden");
      if (warningValue) {
        warningValue.textContent = value.warning;
      }
    } else {
      warningRow?.setAttribute("hidden", "");
    }

    // Handle suggestions
    const suggestionsRow = this.shadowRoot.querySelector(
      '[data-row="suggestions"]',
    );
    const suggestionsList = this.shadowRoot.querySelector(
      '[data-field="suggestions"]',
    );
    if (value.suggestions.length > 0) {
      suggestionsRow?.removeAttribute("hidden");
      if (suggestionsList) {
        suggestionsList.innerHTML = value.suggestions
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
