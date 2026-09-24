const steps = [
  {
    number: '01',
    title: 'Upload',
    description: 'Drop an image in. It is read, indexed and given an ID.',
  },
  {
    number: '02',
    title: 'Transform',
    description: 'Stack operations in order. Each result is saved as its own version.',
  },
  {
    number: '03',
    title: 'Retrieve',
    description: 'Fetch any version in the format you need, from one address.',
  },
]

const HowItWorks = () => {
  return (
    <div className="relative border-t border-white/10 py-16 px-6 md:px-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 max-w-6xl mx-auto">
        {steps.map((step, i) => (
          <div key={step.number} className="relative group">
            <div className="flex items-start gap-4">
              <span className="font-serif text-4xl text-transparent bg-clip-text bg-linear-to-b from-purple-300 to-purple-500/40 leading-none">
                {step.number}
              </span>

              <div className="flex-1 pt-1">
                <h3 className="text-sm uppercase tracking-[0.2em] text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>

            <div className="pointer-events-none absolute -inset-4 rounded-2xl bg-purple-500/0 group-hover:bg-purple-500/5 blur-2xl transition-colors duration-500" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default HowItWorks