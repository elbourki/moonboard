import "react-phone-number-input/style.css";
import classNames from "classnames";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import { handleErrors } from "../../lib/fetch";
import { useRouter } from "next/router";

export default function ConnectEmail() {
  const router = useRouter();

  return (
    <Formik
      initialValues={{
        email: "",
      }}
      onSubmit={(values, { setSubmitting }) =>
        toast.promise(
          fetch("/api/channels/email", {
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
            loading: "Enabling email...",
            success: <b>Email enabled successfully!</b>,
            error: <b>Could not enable email.</b>,
          }
        )
      }
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <p className="text-sm">
            Enter your email address to receive instant emails when something of
            interest happens
          </p>
          <Field
            className="bg-dark-kinda border border-dark-almost rounded p-3 text-sm outline-none w-full"
            type="email"
            name="email"
            placeholder="Your email address"
          />
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
            Enable email notifications
          </button>
        </Form>
      )}
    </Formik>
  );
}
