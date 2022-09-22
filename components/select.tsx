import { Listbox, Transition } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { FieldInputProps } from "formik";
import { Fragment } from "react";

export const Select = ({
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
