import { Transition, Dialog, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Formik, Form, Field, FieldProps } from "formik";
import { useRouter } from "next/router";
import { Fragment } from "react";
import toast from "react-hot-toast";
import { channels } from "../data/channels";
import { networks } from "../data/networks";
import { topics } from "../data/topics";
import { handleErrors } from "../lib/fetch";
import { Select } from "./select";
import Image from "next/image";

export const NewSubscription = ({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const router = useRouter();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black backdrop-blur-xs bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-md bg-dark-very border border-dark-almost/50 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 mb-4 text-white"
                >
                  New subscription
                </Dialog.Title>
                <Formik
                  initialValues={{
                    network: "moonbeam",
                    topic: "democracy:started",
                    channels: channels.map((c) => c.id),
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    toast.promise(
                      fetch("/api/subscribe", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(values),
                      })
                        .then(handleErrors)
                        .then(() => router.replace(router.asPath))
                        .then(() => closeModal())
                        .finally(() => setSubmitting(false)),
                      {
                        loading: "Subscribing...",
                        success: <b>Subscription added successfully!</b>,
                        error: <b>Could not add subscription.</b>,
                      }
                    );
                  }}
                >
                  {({ isSubmitting, isValid }) => (
                    <Form className="space-y-4">
                      <Field name="network">
                        {({ field, form: { setFieldValue } }: FieldProps) => (
                          <RadioGroup
                            value={field.value}
                            onChange={(v) => setFieldValue(field.name, v)}
                          >
                            <RadioGroup.Label className="text-sm">
                              Network
                            </RadioGroup.Label>
                            <div className="space-y-2 mt-2">
                              {networks.map((network) => (
                                <RadioGroup.Option
                                  key={network.name}
                                  value={network.id}
                                  className={({ checked }) =>
                                    classNames(
                                      "border border-dark-almost rounded p-3 cursor-pointer",
                                      {
                                        "bg-dark-kinda": checked,
                                      }
                                    )
                                  }
                                >
                                  {({ checked }) => (
                                    <div className="flex w-full items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Image
                                          alt={network.name}
                                          width={20}
                                          height={20}
                                          src={network.logo}
                                        />
                                        <span className="text-sm font-semibold">
                                          {network.name}
                                        </span>
                                      </div>
                                      {checked && (
                                        <div className="shrink-0 text-white">
                                          <CheckCircleIcon className="h-5 w-5" />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </RadioGroup.Option>
                              ))}
                            </div>
                          </RadioGroup>
                        )}
                      </Field>
                      <Field name="topic">
                        {({ field, form: { setFieldValue } }: FieldProps) => (
                          <div>
                            <label className="text-sm">Topic</label>
                            <Select
                              options={topics}
                              field={field}
                              setFieldValue={setFieldValue}
                            />
                          </div>
                        )}
                      </Field>
                      <Field
                        name="channels"
                        validate={(v: string[]) =>
                          !v.length
                            ? "You need to select at least 1 channel"
                            : undefined
                        }
                      >
                        {({
                          field,
                          form: { setFieldValue },
                          meta: { error, touched },
                        }: FieldProps) => (
                          <div>
                            <label className="text-sm">Channels</label>
                            <Select
                              options={channels}
                              field={field}
                              setFieldValue={setFieldValue}
                              multiple
                            />
                            {error && (
                              <small className="text-red-600 mt-2 block">
                                {error}
                              </small>
                            )}
                          </div>
                        )}
                      </Field>
                      <button
                        disabled={isSubmitting || !isValid}
                        className={classNames(
                          "bg-dark-kinda border border-dark-almost rounded font-semibold p-3 text-sm btn w-full flex items-center justify-center gap-1 h-11.5",
                          {
                            loading: isSubmitting,
                          }
                        )}
                        type="submit"
                      >
                        Add subscription
                      </button>
                    </Form>
                  )}
                </Formik>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
