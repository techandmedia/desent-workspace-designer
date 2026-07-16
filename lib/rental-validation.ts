export const rentalDurations = ["1 month", "3 months", "6 months", "12 months"] as const;

export type RentalFieldErrors = Partial<Record<"name" | "contact" | "date" | "duration", string>>;

export type RentalRequestValues = {
  name: string;
  contact: string;
  date: string;
  duration: string;
  minimumDate: string;
  hasInvalidDateInput: boolean;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const whatsappPattern = /^\+?[0-9][0-9\s().-]{7,}$/;

export function validateRentalRequest(values: RentalRequestValues): RentalFieldErrors {
  const errors: RentalFieldErrors = {};
  const name = values.name.trim();
  const contact = values.contact.trim();

  if (name.length < 2) errors.name = "Enter your full name.";
  if (!contact) {
    errors.contact = "Enter an email address or WhatsApp number.";
  } else if (!emailPattern.test(contact) && !whatsappPattern.test(contact)) {
    errors.contact = "Enter a valid email address or WhatsApp number.";
  }

  if (values.hasInvalidDateInput) {
    errors.date = "Enter a complete, valid calendar date.";
  } else if (!values.date) {
    errors.date = "Choose the date you need your setup.";
  } else if (values.date < values.minimumDate) {
    errors.date = `Choose ${values.minimumDate} or a later date so we can prepare your setup.`;
  }

  if (!rentalDurations.includes(values.duration as (typeof rentalDurations)[number])) {
    errors.duration = "Choose a rental duration.";
  }

  return errors;
}
