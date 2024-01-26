const GradiantBlob = () => {
  return (
    <section
      aria-disabled
      className='absolute left-1/2 top-44 -z-20 flex w-auto -translate-x-1/2 rotate-90 items-center justify-center gap-4 overflow-hidden opacity-30 blur-2xl sm:top-32 sm:rotate-0 sm:gap-8 md:opacity-20'
    >
      <div className='flex flex-col gap-4 sm:gap-8'>
        <div className='h-40 w-40 rounded-full bg-gradient-to-r from-purple-500 to-red-500 sm:h-64 sm:w-52 lg:h-64 lg:w-64' />
        <div className='h-40 w-40 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 sm:h-64 sm:w-52 lg:h-64 lg:w-64' />
      </div>

      <div className='flex flex-col gap-4 sm:gap-8'>
        <div className='h-40 w-40 rounded-full bg-gradient-to-r from-yellow-500 to-green-500 sm:h-64 sm:w-52 lg:h-64 lg:w-64' />
        <div className='h-40 w-40 rounded-full bg-gradient-to-r from-cyan-500 to-zinc-500 sm:h-64 sm:w-52 lg:h-64 lg:w-64' />
      </div>

      <div className='h-40 w-40 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 sm:h-64 sm:w-52 lg:h-64 lg:w-64' />
    </section>
  );
};

export default GradiantBlob;
