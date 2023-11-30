export default function Wallet() {
  return (
    <div class="w-full p-6 max-w-[1300px] mx-auto">
      <div class="flex flex-wrap">
        <div class="w-full max-w-full px-3 shrink-0 ">
          <div class="relative flex flex-col min-w-0 break-words bg-slate-400 border-0 shadow-xl rounded-2xl bg-clip-border">
            <div class="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6 pb-0">
              <div class="flex items-center text-white font-bold text-2xl">
                <p class="mb-0">Manage your profile and security settings</p>
                <button
                  type="button"
                  class="inline-block px-8 py-3 mb-2 ml-auto font-bold leading-normal text-center text-white align-middle transition-all ease-in bg-blue-500 border-0 rounded-lg shadow-md cursor-pointer text-base tracking-tight-rem hover:shadow-xs hover:-translate-y-px active:opacity-85"
                >
                  Update profile
                </button>
              </div>
            </div>
            <div class="flex-auto p-6">
              <p class="leading-normal uppercase text-white font-bold text-sm">
                User Information
              </p>
              <div class="flex flex-wrap">
                <div class="w-full max-w-full px-3 shrink-0 md:w-6/12 md:flex-0">
                  <div class="mb-4">
                    <label
                      for="username"
                      class="inline-block mb-2 ml-1 font-bold text-xs text-slate-700"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-[80%] appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div class="w-full max-w-full px-3 shrink-0 md:w-6/12 md:flex-0">
                  <div class="mb-4">
                    <label
                      for="email"
                      class="inline-block mb-2 ml-1 font-bold text-xs text-slate-700"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-[80%] appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div class="w-full max-w-full px-3 shrink-0 md:w-6/12 md:flex-0">
                  <div class="mb-4">
                    <label
                      for="first name"
                      class="inline-block mb-2 ml-1 font-bold text-xs text-slate-700"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      name="first name"
                      class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-[80%] appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div class="w-full max-w-full px-3 shrink-0 md:w-6/12 md:flex-0">
                  <div class="mb-4">
                    <label
                      for="last name"
                      class="inline-block mb-2 ml-1 font-bold text-xs text-slate-700"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      name="last name"
                      class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-[80%] appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <hr class="h-px mx-0 my-4 bg-transparent border-0 opacity-100 bg-gradient-to-r from-blue-300 to-green-300" />

              <p class="leading-normal uppercase font-bold text-white text-sm">
                Contact Information
              </p>
              <div class="flex flex-wrap -mx-3">
                <div class="w-full max-w-full px-3 shrink-0 md:w-full md:flex-0">
                  <div class="mb-4">
                    <label
                      for="address"
                      class="inline-block mb-2 ml-1 font-bold text-xs text-slate-700"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div class="w-full max-w-full px-3 shrink-0 md:w-4/12 md:flex-0">
                  <div class="mb-4">
                    <label
                      for="city"
                      class="inline-block mb-2 ml-1 font-bold text-xs text-slate-700"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div class="w-full max-w-full px-3 shrink-0 md:w-4/12 md:flex-0">
                  <div class="mb-4">
                    <label
                      for="country"
                      class="inline-block mb-2 ml-1 font-bold text-xs text-slate-700"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div class="w-full max-w-full px-3 shrink-0 md:w-4/12 md:flex-0">
                  <div class="mb-4">
                    <label
                      for="postal code"
                      class="inline-block mb-2 ml-1 font-bold text-xs text-slate-700"
                    >
                      Postal code
                    </label>
                    <input
                      type="text"
                      name="postal code"
                      class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <hr class="h-px mx-0 my-4 bg-transparent border-0 opacity-100 bg-gradient-to-r from-blue-300 to-green-300" />

              <p class="leading-normal uppercase text-sm mb-2 font-bold text-white">
                Description
              </p>
              <div class="flex flex-wrap -mx-3">
                <div class="w-full max-w-full px-3 shrink-0 md:w-full md:flex-0">
                  <div class="mb-4">
                    <input
                      type="text"
                      name="about me"
                      class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <hr class="h-px mx-0 my-4 bg-transparent border-0 opacity-100 bg-gradient-to-r from-blue-300 to-green-300" />

              <div class="flex-auto">
                <p class="leading-normal uppercase text-white font-bold text-sm">
                  Password
                </p>
                <div class="flex flex-wrap">
                  <div class="w-full max-w-full px-3 shrink-0 md:w-6/12 md:flex-0">
                    <div class="mb-4">
                      <label
                        for="username"
                        class="inline-block mb-2 ml-1 font-bold text-xs text-slate-700"
                      >
                        Old password
                      </label>
                      <input
                        type="text"
                        name="username"
                        class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-[80%] appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div class="w-full max-w-full px-3 shrink-0 md:w-6/12 md:flex-0">
                    <div class="mb-4">
                      <label
                        for="email"
                        class="inline-block mb-2 ml-1 font-bold text-xs text-slate-700"
                      >
                        New password
                      </label>
                      <input
                        type="email"
                        name="email"
                        class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-[80%] appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div class="w-full max-w-full px-3 shrink-0 md:w-6/12 md:flex-0">
                    <div class="mb-4">
                      <label
                        for="email"
                        class="inline-block mb-2 ml-1 font-bold text-xs text-slate-700"
                      >
                        Re-enter new password
                      </label>
                      <input
                        type="email"
                        name="email"
                        class="focus:shadow-primary-outline text-sm leading-5.6 ease block w-[80%] appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
