'use client'

import { useState } from 'react'

// Define course modules
const modules = [
  {
    title:
      'MODULE 1: DREAM BIG, FUND SMART – INTRODUCTION TO VENTURE CAPITAL FOR AFRICAN FOUNDERS',
    duration: '2 Weeks',
    Format: 'Text-Based Learning (Readings, Reflections, Quizzes, Assignments)',
    level: 'Beginner',
    description:
      'This module introduces the fundamentals of venture capital (VC) through the story of Zara, an aspiring African founder with big dreams but limited funding. You’ll learn what VC is, how it works in Africa, and how to identify the right investors for your startup. Real-world examples like Flutterwave and Paystack will ground these concepts in relatable success stories.',
    keyQuestions: [
      'What exactly is venture capital, and why is it critical for African startups?',
      'How do VCs make money, and what do they look for in startups?',
      'Where can African founders find the right investors?',
    ],
    content: {
      heading: 'Dream Big, Fund Smart.',
      content1:
        'Zara slouched in her chair, scrolling through her phone while the sound of Lagos traffic buzzed in the background. She had big dreams for her app — a digital platform that could connect volunteers with local NGOs across Africa, making it easier to find and contribute to grassroots projects. But every time she thought about the money it would take to get her idea off the ground, reality kicked in hard.',
      content2:
        '“Venture capital,” he had said, like it was some kind of magic spell.',
      content3:
        '“Yeah, it is,” he laughed, “but it’s exactly what you need. Venture capitalists, or VCs, aren’t just in it for the money. They’re the ones who find high-potential ideas that could change the game — especially tech-driven ones — and help them go big. They’ll even give guidance to help grow it.”',
      content4:
        'That night, Zara’s curiosity got the better of her. She stayed up late reading about VC funding and came across the story of Flutterwave. Founded by two young Nigerians, Flutterwave had started as an ambitious vision to simplify payments across Africa. They pitched the concept to some VCs, and before long, they had raised millions in funding. Today, Flutterwave was one of the most successful tech companies on the continent, allowing African businesses to handle payments seamlessly across borders.',
      content5:
        "It clicked for Zara. She realized that if she wanted her app to reach every corner of Africa, she’d need someone with not just cash but expertise and connections. VCs usually raise money from 'Limited Partners,' or LPs, like banks, wealthy individuals, or even university endowments, and take big risks by investing in companies that could potentially make them billions. But she also knew it wasn’t all smooth sailing — startups were a high-risk game. Out of every 15 investments a VC made, only a few would hit it big.",
      content6:
        "Before she knew it, Zara was deep in thought about who she’d want on her own 'dream team' of investors. Sequoia, Andreessen Horowitz, and maybe even a partnership with the Nigerian accelerator, Ingressive Capital, which had backed several rising tech stars. These firms were experts at spotting potential in the ideas no one else took seriously yet.",
      content7:
        'As she leaned back, she couldn’t help but smile. Her app was no longer just a dream. With the right backing, it was one step closer to being the real deal.',
      content8:
        'Alright, now that you’ve stepped into Zara’s shoes, here’s the scoop on what venture capital is all about:',
      content9:
        'Venture Capital (VC) is a type of funding designed for startups with big dreams and the guts to make it happen. VCs usually pull cash from Limited Partners (LPs) — like banks or rich individuals — and pour it into startups that seem risky but have massive growth potential. They don’t just hand over cash, though. VCs give advice, connections, and expertise to help founders reach success.',
      content10:
        'Startups have a high failure rate (around 90%), so VCs know that some investments will flop. But they’re betting on that one game-changer in their portfolio to skyrocket, covering all the losses and making the whole fund profitable. That’s why you’ll see VCs backing bold ideas that might seem too risky for traditional investors.',
      content11:
        'Here’s a great example: Nigeria’s Paystack started small with a goal to make online payments in Africa easier. After getting VC funding, Paystack scaled rapidly and, a few years down the road, was bought by Stripe for over $200 million! Paystack’s early investors saw a huge return because they believed in the potential.',
    },
  },
  { title: 'Market Research', content: 'Content of Module 2...' },
  { title: 'Building a Business Plan', content: 'Content of Module 3...' },
  { title: 'Fundraising and Pitching', content: 'Content of Module 4...' },
  // Add more modules as needed
]

export default function StartupFoundersBasicsPage() {
  // State to track current module
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)

  // Function to go to next module
  const nextModule = () => {
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1)
    }
  }

  // Function to go to previous module
  const previousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1)
    }
  }

  const currentModule = modules[currentModuleIndex]

  return (
    <div className='p-4'>
      <h1 className='text-xl font-semibold'>{currentModule.title}</h1>
      <p>Duration: {currentModule.duration}</p>
      <p>Format: {currentModule.Format}</p>
      <p>Level: {currentModule.level}</p>
      <p>Description: {currentModule.description}</p>
      <p>Key Questions We’ll Answer:</p>
      <ul className='list-disc pl-5'>
        {currentModule?.keyQuestions?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <h1 className='mt-4 text-black'>CASE STORY</h1>
      <div className='mt-4'>
        {Object.keys(currentModule.content).map(
          (key, index) =>
            key !== 'heading' && (
              <p key={index} className='mb-4'>
                {currentModule.content[key]}
              </p>
            )
        )}
      </div>
      <div className='flex gap-4 mt-4'>
        <button
          onClick={previousModule}
          className='px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50'
          disabled={currentModuleIndex === 0} // Disable if first module
        >
          Previous
        </button>
        <button
          onClick={nextModule}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50'
          disabled={currentModuleIndex === modules.length - 1} // Disable if last module
        >
          Next
        </button>
      </div>
    </div>
  )
}
