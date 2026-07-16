"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { byId, formatIDR, products, type Category, type Product } from "../lib/products";
import {
  rentalDurations,
  validateRentalRequest,
  type RentalFieldErrors,
} from "../lib/rental-validation";

type Config = {
  desk: string;
  chair: string;
  monitor: number;
  lamp: number;
  plant: number;
  accessory: number;
};
const defaultConfig: Config = {
  desk: "desk-arc",
  chair: "chair-cloud",
  monitor: 1,
  lamp: 1,
  plant: 1,
  accessory: 1,
};
const labels: Record<Category, string> = {
  desk: "Desk",
  chair: "Chair",
  monitor: "Monitor",
  lamp: "Lamp",
  plant: "Plant",
  accessory: "Desk mat",
};

function productFor(category: Category) {
  return products.find((item) => item.category === category)!;
}

function dateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function WorkspaceDesigner() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("monis-setup");
    if (saved) setConfig(JSON.parse(saved) as Config);
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) localStorage.setItem("monis-setup", JSON.stringify(config));
  }, [config, hydrated]);
  const selected = useMemo(
    () => [
      byId(config.desk),
      byId(config.chair),
      ...(["monitor", "lamp", "plant", "accessory"] as const)
        .filter((key) => config[key] > 0)
        .map(productFor),
    ],
    [config],
  );
  const total = selected.reduce(
    (sum, item) =>
      sum +
      item.price *
        (item.category === "desk" || item.category === "chair" ? 1 : config[item.category]),
    0,
  );
  const updateQty = (category: "monitor" | "lamp" | "plant" | "accessory", delta: number) =>
    setConfig((old) => ({
      ...old,
      [category]: Math.max(0, Math.min(category === "monitor" ? 3 : 1, old[category] + delta)),
    }));

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#studio">
          monis<span>.</span>rent
        </a>
        <p className="location">
          <i /> Delivered across Bali
        </p>
        <button
          className="summary-button"
          onClick={() => setCheckoutOpen(true)}
          aria-label="Open your setup summary"
        >
          <span>Your setup</span>
          <b>{formatIDR(total)}</b>
          <ArrowRightIcon />
        </button>
      </header>
      <section className="hero" id="studio">
        <div className="hero-copy">
          <p className="eyebrow">
            <SparklesIcon /> Your work, your way
          </p>
          <h1>
            A workspace that
            <br />
            <em>feels like you.</em>
          </h1>
          <p>
            Build a focused setup for your Bali chapter. We deliver, assemble, and pick it up when
            you&apos;re ready to move.
          </p>
          <div className="mini-proof">
            <span>✦</span> Flexible from 1 month <span>✦</span> Set up in 48 hours
          </div>
        </div>
        <div className="preview-wrap">
          <WorkspacePreview config={config} />
          <div className="preview-note">
            <span>Live preview</span>
            <b>Your space, evolving</b>
          </div>
        </div>
      </section>
      <section className="builder" aria-label="Customize your workspace">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 — Build your base</p>
            <h2>Choose your essentials</h2>
          </div>
          <button onClick={() => setConfig(defaultConfig)} className="reset">
            Reset setup
          </button>
        </div>
        <div className="choice-grid">
          <ProductPicker
            title="Desk"
            items={products.filter((p) => p.category === "desk")}
            selected={config.desk}
            onSelect={(id) => setConfig({ ...config, desk: id })}
          />
          <ProductPicker
            title="Chair"
            items={products.filter((p) => p.category === "chair")}
            selected={config.chair}
            onSelect={(id) => setConfig({ ...config, chair: id })}
          />
        </div>
        <div className="section-heading addons-heading">
          <div>
            <p className="eyebrow">02 — Make it yours</p>
            <h2>Add the finishing touches</h2>
          </div>
          <p className="muted">Only pay for what you need</p>
        </div>
        <div className="addon-grid">
          {(["monitor", "lamp", "plant", "accessory"] as const).map((category) => (
            <Addon
              key={category}
              item={productFor(category)}
              quantity={config[category]}
              onChange={(d) => updateQty(category, d)}
            />
          ))}
        </div>
      </section>
      <section className="sticky-total">
        <div>
          <span>Monthly rental estimate</span>
          <strong>
            {formatIDR(total)} <small>/ month</small>
          </strong>
        </div>
        <button onClick={() => setCheckoutOpen(true)}>
          Review & rent <ArrowRightIcon />
        </button>
      </section>
      {checkoutOpen && (
        <Checkout config={config} total={total} onClose={() => setCheckoutOpen(false)} />
      )}
    </main>
  );
}

function ProductPicker({
  title,
  items,
  selected,
  onSelect,
}: {
  title: string;
  items: Product[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <article className="picker">
      <h3>{title}</h3>
      <div className="product-options">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`product-option ${selected === item.id ? "selected" : ""}`}
          >
            <span className="swatch" style={{ background: item.color }} />
            <span>
              <b>{item.name}</b>
              <small>{item.description}</small>
            </span>
            <strong>{formatIDR(item.price)}</strong>
            {selected === item.id && (
              <i className="selected-tick">
                <CheckIcon />
              </i>
            )}
          </button>
        ))}
      </div>
    </article>
  );
}

function Addon({
  item,
  quantity,
  onChange,
}: {
  item: Product;
  quantity: number;
  onChange: (delta: number) => void;
}) {
  return (
    <article className={`addon ${quantity ? "active" : ""}`}>
      <span className="addon-icon" style={{ background: item.color }}>
        {item.category === "monitor"
          ? "▣"
          : item.category === "lamp"
            ? "◒"
            : item.category === "plant"
              ? "♧"
              : "◇"}
      </span>
      <div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <b>
          {formatIDR(item.price)} <small>/ month</small>
        </b>
      </div>
      {item.category === "monitor" && quantity > 0 ? (
        <div className="quantity" aria-label={`Quantity ${item.name}`}>
          <button onClick={() => onChange(-1)} aria-label={`Remove ${item.name}`}>
            <MinusIcon />
          </button>
          <span>{quantity}</span>
          <button onClick={() => onChange(1)} aria-label={`Add ${item.name}`}>
            <PlusIcon />
          </button>
        </div>
      ) : (
        <button
          className="addon-toggle"
          onClick={() => onChange(quantity ? -1 : 1)}
          aria-pressed={quantity > 0}
        >
          {quantity > 0 ? (
            <>
              <CheckIcon /> Added — remove
            </>
          ) : (
            <>
              <PlusIcon /> Add to setup
            </>
          )}
        </button>
      )}
    </article>
  );
}

function WorkspacePreview({ config }: { config: Config }) {
  const desk = byId(config.desk);
  const chair = byId(config.chair);
  return (
    <div className="workspace-scene" aria-label="Visual preview of your selected workspace">
      <div className="sun" />
      <div className="arch" />
      <div className="shadow" />
      <div className="plant-shape" style={{ opacity: config.plant ? 1 : 0 }}>
        <i />
        <i />
        <i />
      </div>
      <div className="lamp-shape" style={{ opacity: config.lamp ? 1 : 0 }}>
        <i />
      </div>
      <div className="desk-shape" style={{ "--desk": desk.color } as React.CSSProperties}>
        <i />
        <i />
      </div>
      <div className="mat-shape" style={{ opacity: config.accessory ? 1 : 0 }} />
      <div className="monitor-row">
        {Array.from({ length: config.monitor }).map((_, i) => (
          <div
            className="monitor-shape"
            key={i}
            style={{
              transform: `translateX(${(i - (config.monitor - 1) / 2) * 70}px)`,
            }}
          >
            <i />
          </div>
        ))}
      </div>
      <div className="chair-shape" style={{ "--chair": chair.color } as React.CSSProperties}>
        <i />
        <i />
      </div>
      <div className="floor" />
    </div>
  );
}

function Checkout({
  config,
  total,
  onClose,
}: {
  config: Config;
  total: number;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<RentalFieldErrors>({});
  const items = [
    byId(config.desk),
    byId(config.chair),
    ...(["monitor", "lamp", "plant", "accessory"] as const)
      .filter((k) => config[k])
      .map(productFor),
  ];
  const qty = (p: Product) =>
    p.category === "desk" || p.category === "chair" ? 1 : config[p.category];
  const earliestRentalDate = new Date();
  earliestRentalDate.setDate(earliestRentalDate.getDate() + 2);
  const minRentalDate = dateInputValue(earliestRentalDate);
  function updateFieldError(field: keyof RentalFieldErrors, message?: string) {
    setFieldErrors((current) => {
      const next = { ...current, [field]: message };
      if (Object.values(next).every((value) => !value)) setError("");
      return next;
    });
  }
  function validateTextField(field: "name" | "contact", value: string) {
    const validation = validateRentalRequest({
      name: field === "name" ? value : "Workspace guest",
      contact: field === "contact" ? value : "guest@example.com",
      date: minRentalDate,
      duration: rentalDurations[0],
      minimumDate: minRentalDate,
      hasInvalidDateInput: false,
    });
    updateFieldError(field, validation[field]);
  }
  function validateDuration(value: string) {
    const validation = validateRentalRequest({
      name: "Workspace guest",
      contact: "guest@example.com",
      date: minRentalDate,
      duration: value,
      minimumDate: minRentalDate,
      hasInvalidDateInput: false,
    });
    updateFieldError("duration", validation.duration);
  }
  function validateRentalDate(input: HTMLInputElement, reportEmpty = false) {
    let dateError = "";
    if (input.validity.badInput) {
      dateError = "Enter a complete, valid calendar date.";
    } else if (!input.value) {
      dateError = reportEmpty ? "Choose the date you need your setup." : "";
    } else if (input.value < minRentalDate) {
      dateError = `Choose ${minRentalDate} or a later date so we can prepare your setup.`;
    }
    updateFieldError("date", dateError);
    return !dateError;
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dateInput = event.currentTarget.elements.namedItem("date") as HTMLInputElement;
    const nextErrors = validateRentalRequest({
      name: String(data.get("name") ?? ""),
      contact: String(data.get("contact") ?? ""),
      date: String(data.get("date") ?? ""),
      duration: String(data.get("duration") ?? ""),
      minimumDate: minRentalDate,
      hasInvalidDateInput: dateInput.validity.badInput,
    });
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setError("Please review the highlighted fields before sending your request.");
      return;
    }
    setError("");
    setSubmitted(true);
  }
  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="checkout"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        <button className="close" onClick={onClose} aria-label="Close checkout">
          <XMarkIcon />
        </button>
        {submitted ? (
          <div className="confirmation">
            <span>
              <CheckIcon />
            </span>
            <p className="eyebrow">Request received</p>
            <h2>You&apos;re on your way to a better workday.</h2>
            <p>
              Our Bali setup team will confirm availability and delivery details within one business
              day.
            </p>
            <button onClick={onClose}>Back to studio</button>
          </div>
        ) : (
          <>
            <div className="checkout-title">
              <p className="eyebrow">Your selected setup</p>
              <h2 id="checkout-title">Ready when you are.</h2>
            </div>
            <div className="checkout-content">
              <div className="order">
                <div className="order-items">
                  {items.map((item) => (
                    <div key={item.id}>
                      <span>
                        {labels[item.category]} <b>× {qty(item)}</b>
                      </span>
                      <strong>{formatIDR(item.price * qty(item))}</strong>
                    </div>
                  ))}
                </div>
                <div className="total-line">
                  <span>Monthly estimate</span>
                  <b>
                    {formatIDR(total)}
                    <small> / month</small>
                  </b>
                </div>
              </div>
              <form onSubmit={submit} noValidate>
                <label>
                  Name
                  <input
                    name="name"
                    placeholder="Your name"
                    autoComplete="name"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby="rental-name-error"
                    onInput={(event) => validateTextField("name", event.currentTarget.value)}
                    onBlur={(event) => validateTextField("name", event.currentTarget.value)}
                  />
                  {fieldErrors.name && (
                    <small className="date-error" id="rental-name-error" role="alert">
                      {fieldErrors.name}
                    </small>
                  )}
                </label>
                <label>
                  Email or WhatsApp
                  <input
                    name="contact"
                    placeholder="you@email.com / +62..."
                    aria-invalid={Boolean(fieldErrors.contact)}
                    aria-describedby="rental-contact-error"
                    onInput={(event) => validateTextField("contact", event.currentTarget.value)}
                    onBlur={(event) => validateTextField("contact", event.currentTarget.value)}
                  />
                  {fieldErrors.contact && (
                    <small className="date-error" id="rental-contact-error" role="alert">
                      {fieldErrors.contact}
                    </small>
                  )}
                </label>
                <div className="form-row">
                  <label>
                    Need it from
                    <input
                      name="date"
                      type="date"
                      min={minRentalDate}
                      aria-describedby="rental-date-hint rental-date-error"
                      aria-invalid={Boolean(fieldErrors.date)}
                      onInput={(event) => validateRentalDate(event.currentTarget)}
                      onBlur={(event) => validateRentalDate(event.currentTarget)}
                    />
                    <small className="date-hint" id="rental-date-hint">
                      Available from {minRentalDate} · setup takes up to 48 hours
                    </small>
                    {fieldErrors.date && (
                      <small className="date-error" id="rental-date-error" role="alert">
                        {fieldErrors.date}
                      </small>
                    )}
                  </label>
                  <label>
                    Duration
                    <select
                      name="duration"
                      defaultValue=""
                      aria-invalid={Boolean(fieldErrors.duration)}
                      aria-describedby="rental-duration-error"
                      onChange={(event) => validateDuration(event.currentTarget.value)}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {rentalDurations.map((duration) => (
                        <option key={duration}>{duration}</option>
                      ))}
                    </select>
                    {fieldErrors.duration && (
                      <small className="date-error" id="rental-duration-error" role="alert">
                        {fieldErrors.duration}
                      </small>
                    )}
                  </label>
                </div>
                {error && <p className="form-error">{error}</p>}
                <button className="rent-submit" type="submit">
                  Send rental request <ArrowRightIcon />
                </button>
                <p className="form-note">
                  No payment today. We&apos;ll confirm availability first.
                </p>
              </form>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
