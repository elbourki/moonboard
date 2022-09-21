import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import classNames from "classnames";
import { Formik, Form, Field, FieldProps } from "formik";
import toast from "react-hot-toast";
import { handleErrors } from "../../lib/fetch";
import { useRouter } from "next/router";

export default function ConnectPhone() {
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        number: "",
      }}
      onSubmit={(values, { setSubmitting }) =>
        toast.promise(
          fetch("/api/channels/sms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
            .then(handleErrors)
            .then(() => router.replace(router.asPath))
            .finally(() => setSubmitting(false)),
          {
            loading: "Enabling SMS...",
            success: <b>SMS enabled successfully!</b>,
            error: <b>Could not enable SMS.</b>,
          }
        )
      }
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <p className="text-sm mb-4">
            Enter your phone number to receive instant SMS messages when
            something of interest happens
          </p>
          <Field name="number">
            {({ field, form: { setFieldValue } }: FieldProps) => (
              <PhoneInput
                placeholder="Your phone number"
                value={field.value}
                onChange={(v) => setFieldValue(field.name, v)}
              />
            )}
          </Field>
          <button
            disabled={isSubmitting}
            className={classNames(
              "bg-dark-kinda border border-dark-almost rounded font-semibold p-3 text-sm btn w-full flex items-center justify-center gap-1 h-11.5",
              {
                loading: isSubmitting,
              }
            )}
            type="submit"
          >
            Enable SMS notifications
          </button>
        </Form>
      )}
    </Formik>
  );
}
