import { Transition, Dialog, RadioGroup, Listbox } from "@headlessui/react";
import classNames from "classnames";
import { Field, FieldInputProps, FieldProps, Form, Formik } from "formik";
import type { NextPage } from "next";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { withSessionSsr } from "../lib/iron";
import {
  PlusCircleIcon,
  CheckCircleIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { supabase, Channel } from "../lib/supabase";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { handleErrors } from "../lib/fetch";
import { channels } from "../data/channels";
import { networks } from "../data/networks";
import { topics } from "../data/topics";
import { Channels } from "../components/channels";

const NewSubscription = ({
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

const Select = ({
  field,
  setFieldValue,
  options,
  multiple = false,
}: {
  options: { id: string; name: string }[];
  field: FieldInputProps<any>;
  setFieldValue: (f: string, v: any) => void;
  multiple?: boolean;
}) => {
  return (
    <Listbox
      value={field.value}
      onChange={(v) => setFieldValue(field.name, v)}
      multiple={multiple}
    >
      <div className="relative mt-2">
        <Listbox.Button className="relative w-full border border-dark-almost rounded p-3 pr-10 text-left cursor-pointer">
          <span className="block truncate text-sm">
            {multiple
              ? `${field.value.length} Selected`
              : options.find((option) => option.id === field.value)?.name}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto bg-dark-kinda border border-dark-almost rounded py-1 z-50">
            {options.map((option, i) => (
              <Listbox.Option
                key={i}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2.5 pl-10 pr-2",
                    {
                      "bg-dark-almost": active,
                    }
                  )
                }
                value={option.id}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={classNames("block truncate text-sm", {
                        "font-semibold": selected,
                      })}
                    >
                      {option.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                        <CheckCircleIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

const Subscriptions = () => {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Subscriptions</h1>
      <p className="text-dark-soft font-normal text-sm mt-1 mb-6">
        Choose which events you want to be notified about
      </p>
      <div className="grid grid-cols-3 gap-4">
        <div
          onClick={() => setIsOpen(true)}
          className="bg-dark-kinda border border-dark-almost rounded min-h-[170px] flex cursor-pointer p-4"
        >
          <div className="flex gap-2 items-center mt-auto opacity-60">
            <PlusCircleIcon className="h-6 w-6" />
            <span className="text-sm">New Subscription</span>
          </div>
        </div>
      </div>
      <NewSubscription isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </div>
  );
};

const Dashboard: NextPage<{
  channels: { channel: string }[];
}> = ({ channels }) => {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash?.substring(1));
    if (params.get("access_token"))
      toast.promise(
        fetch("/api/channels/discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: params.get("access_token"),
          }),
        })
          .then(handleErrors)
          .then(() => router.replace(router.asPath.split("#")[0])),
        {
          loading: "Linking Discord...",
          success: <b>Discord linked successfully!</b>,
          error: <b>Could not link Discord.</b>,
        }
      );
  }, [router]);

  return (
    <>
      <Channels channels={channels} />
      <Subscriptions />
    </>
  );
};

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user || null;

    if (!user)
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };

    const { data: channels } = await supabase
      .from<Channel>("channels")
      .select("channel");

    return { props: { user, channels } };
  }
);

export default Dashboard;
