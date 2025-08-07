"use client"

import { useState, useEffect } from "react"
import { Plus } from 'lucide-react'
import Image from "next/image"

type ItemStatus = "inactive" | "active" | "critical"
type Person = "CAIO" | "ADRIANO" | "RITA"

interface CheckableItem {
  id: string
  text: string
  status: ItemStatus
  system?: boolean
}

interface Protocol {
  id: string
  name: string
  percentage: number
  checked: boolean
  disabled?: boolean
}

interface Assignment {
  id: string
  text: string
  status: ItemStatus
  visible: boolean
  isDrug?: boolean
}

interface AppState {
  checkableItems: CheckableItem[]
  protocols: Protocol[]
  assignments: {
    CAIO: Assignment[]
    ADRIANO: Assignment[]
    RITA: Assignment[]
  }
}

// Default initial state
const getDefaultState = (): AppState => ({
  checkableItems: [
    // Column A
    { id: "speaks-clearly", text: "Speaks clearly", status: "critical", system: true },
    { id: "clear-airway", text: "Clear airway", status: "inactive" },
    { id: "clear-resp-sounds", text: "Clear resp. sounds", status: "active", system: true },
    // Column B  
    { id: "high-rr", text: "High RR (24cpm)", status: "critical", system: true },
    { id: "normal-spo2", text: "Normal SpO2 (95%)", status: "active" },
    { id: "no-difficulty-breathing", text: "No difficulty breathing", status: "inactive" },
    { id: "symmetric-movement", text: "Symmetric movement", status: "inactive" },
    { id: "symmetric-sounds", text: "Symmetric sounds", status: "inactive" },
    { id: "trachea-midline", text: "Trachea in the midline", status: "inactive" },
    // Column C
    { id: "high-hr", text: "High HR (220 bpm)", status: "critical", system: true },
    { id: "short-complex-tachi", text: "Short Complex Tachi.", status: "critical", system: true },
    { id: "low-bp", text: "Low BP (60/40mmHg)", status: "critical", system: true },
    { id: "distal-perfusion", text: "Distal perfusion", status: "critical", system: true },
    { id: "no-massive-bleeding", text: "No massive bleeding", status: "inactive" },
    // Column D
    { id: "unresponsive", text: "Unresponsive", status: "critical", system: true },
    { id: "pupils-reaction", text: "Pupils reaction", status: "inactive" },
    { id: "normal-blood-sugar", text: "Normal blood sugar", status: "active", system: true },
    // Column E
    { id: "normal-temperature", text: "Normal Temperature", status: "active" },
    { id: "no-wounds", text: "No wounds", status: "inactive" },
    { id: "no-fractures", text: "No fractures", status: "inactive" },
    { id: "no-trauma-history", text: "No trauma history", status: "active", system: true },
    { id: "no-spacesuit-damage", text: "No spacesuit damage", status: "active", system: true },
    { id: "no-active-bleeding", text: "No active Bleeding", status: "inactive" },
  ],
  protocols: [
    { id: "emergency", name: "Emergency", percentage: 100, checked: false, disabled: false },
    { id: "tachydisrithmias", name: "Tachydisrithmias", percentage: 91, checked: false, disabled: false },
    { id: "stroke", name: "Stroke", percentage: 34, checked: false, disabled: false },
    { id: "trauma", name: "Trauma", percentage: 9, checked: false, disabled: false },
  ],
  assignments: {
    CAIO: [
      { id: "caio-1", text: "Prepare infirmary", status: "inactive" as ItemStatus, visible: false, isDrug: false },
      { id: "caio-2", text: "Prepare IV mat.", status: "critical" as ItemStatus, visible: false, isDrug: false },
      { id: "caio-3", text: "Prepare drugs", status: "critical" as ItemStatus, visible: false, isDrug: true },
    ],
    ADRIANO: [
      { id: "adriano-1", text: "Meet Diogo", status: "inactive" as ItemStatus, visible: false, isDrug: false },
      { id: "adriano-2", text: "Diogo to Rover", status: "critical" as ItemStatus, visible: false, isDrug: false },
    ],
    RITA: [
      { id: "rita-1", text: "Max EVA1 suit O2", status: "inactive" as ItemStatus, visible: false, isDrug: false },
      { id: "rita-2", text: "Ensure meeting safety", status: "critical" as ItemStatus, visible: false, isDrug: false },
    ],
  }
})

export default function EmergencyPanel() {
  // 1) Track whether we've hydrated on the client yet
  const [hydrated, setHydrated] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  // 2) Load saved state only once, after hydration
  const [checkableItems, setCheckableItems] = useState<CheckableItem[]>([])
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [assignments, setAssignments] = useState<{
    CAIO: Assignment[]
    ADRIANO: Assignment[]
    RITA: Assignment[]
  }>({
    CAIO: [],
    ADRIANO: [],
    RITA: []
  })

  const [showModal, setShowModal] = useState<{
    show: boolean
    itemId: string
    currentStatus: ItemStatus
  }>({
    show: false,
    itemId: "",
    currentStatus: "inactive"
  })

  const [showNonSystemModal, setShowNonSystemModal] = useState<{
    show: boolean
    itemId: string
  }>({
    show: false,
    itemId: ""
  })

  // New modal states for special items
  const [showPupilsModal, setShowPupilsModal] = useState<{
    show: boolean
    step: 1 | 2
    itemId: string
  }>({
    show: false,
    step: 1,
    itemId: ""
  })

  const [showWoundsModal, setShowWoundsModal] = useState<{
    show: boolean
    itemId: string
  }>({
    show: false,
    itemId: ""
  })

  const [showFracturesModal, setShowFracturesModal] = useState<{
    show: boolean
    itemId: string
  }>({
    show: false,
    itemId: ""
  })

  // Hydration effect - runs once on client mount
  useEffect(() => {
    // Now that we're client-side, try to rehydrate from localStorage
    let initial: AppState
    try {
      const saved = localStorage.getItem('emergency-panel-state-v2')
      console.log('Loading from localStorage:', saved ? 'Found saved data' : 'No saved data found')
      
      if (saved) {
        const parsed = JSON.parse(saved) as AppState
        if (parsed.checkableItems && parsed.protocols && parsed.assignments) {
          console.log('Using saved state')
          initial = parsed
        } else {
          console.log('Invalid saved state, using default')
          initial = getDefaultState()
        }
      } else {
        console.log('No saved state found, using default')
        initial = getDefaultState()
      }
    } catch (error) {
      console.log('Error loading saved state, using default:', error)
      initial = getDefaultState()
    }

    setCheckableItems(initial.checkableItems)
    setProtocols(initial.protocols)
    setAssignments(initial.assignments)
    setHydrated(true)
    setInitialLoadComplete(true)
  }, [])

  // Save state to localStorage whenever state changes (only after initial load is complete)
  useEffect(() => {
    if (!initialLoadComplete) {
      console.log('Skipping save - initial load not complete')
      return // Don't save until initial load is complete
    }
    
    const stateToSave: AppState = {
      checkableItems,
      protocols,
      assignments
    }
    console.log('Saving to localStorage')
    localStorage.setItem('emergency-panel-state-v2', JSON.stringify(stateToSave))
  }, [checkableItems, protocols, assignments, initialLoadComplete])

  // Save state when component unmounts (navigation away)
  useEffect(() => {
    if (!initialLoadComplete) return;
    localStorage.setItem(
      'emergency-panel-state-v2',
      JSON.stringify({ checkableItems, protocols, assignments })
    );
  }, [checkableItems, protocols, assignments, initialLoadComplete]);

  // 3) Don't render *any* UI until after hydration
  if (!hydrated) return null

  const toggleItemStatus = (id: string) => {
    const item = checkableItems.find(i => i.id === id)
    if (!item) return

    // Handle special cases
    if (id === "pupils-reaction") {
      setShowPupilsModal({
        show: true,
        step: 1,
        itemId: id
      })
      return
    }

    if (id === "no-wounds") {
      setShowWoundsModal({
        show: true,
        itemId: id
      })
      return
    }

    if (id === "no-fractures") {
      setShowFracturesModal({
        show: true,
        itemId: id
      })
      return
    }

    if (item.system) {
      // For system items, show automatic evaluation modal
      const newStatus = item.status === "inactive" ? "active" : item.status === "active" ? "critical" : "active"
      setShowModal({
        show: true,
        itemId: id,
        currentStatus: newStatus
      })
    } else {
      // For non-system items, show True/False modal
      setShowNonSystemModal({
        show: true,
        itemId: id
      })
    }
  }

  const handleModalResponse = (keepStatus: boolean) => {
    const { itemId } = showModal
    // Set system property to false since human interacted with it
    setCheckableItems(prev =>
      prev.map(item => 
        item.id === itemId ? { 
          ...item, 
          system: false, // Human interacted, so no longer system controlled
          status: !keepStatus ? 
            (item.status === "inactive" ? "active" : item.status === "active" ? "critical" : "active") : 
            item.status
        } : item
      )
    )
    setShowModal({ show: false, itemId: "", currentStatus: "inactive" })
  }

  const handleNonSystemModalResponse = (setToActive: boolean) => {
    const { itemId } = showNonSystemModal
    setCheckableItems(prev =>
      prev.map(item => 
        item.id === itemId ? { 
          ...item, 
          status: setToActive ? "active" : "critical" 
        } : item
      )
    )
    setShowNonSystemModal({ show: false, itemId: "" })
  }

  // Handle pupils modal responses
  const handlePupilsModalResponse = (response: boolean) => {
    const { step, itemId } = showPupilsModal
    
    if (step === 1) {
      if (!response) {
        // False for symmetric pupils - set to critical
        setCheckableItems(prev =>
          prev.map(item => 
            item.id === itemId ? { ...item, status: "critical" } : item
          )
        )
        setShowPupilsModal({ show: false, step: 1, itemId: "" })
      } else {
        // True for symmetric pupils - show second modal
        setShowPupilsModal({ show: true, step: 2, itemId })
      }
    } else {
      // Step 2 - pupils react to light
      setCheckableItems(prev =>
        prev.map(item => 
          item.id === itemId ? { 
            ...item, 
            status: response ? "active" : "critical" 
          } : item
        )
      )
      setShowPupilsModal({ show: false, step: 1, itemId: "" })
    }
  }

  // Handle wounds modal response
  const handleWoundsModalResponse = (hasWounds: boolean) => {
    const { itemId } = showWoundsModal
    setCheckableItems(prev =>
      prev.map(item => 
        item.id === itemId ? { 
          ...item, 
          status: hasWounds ? "critical" : "active" 
        } : item
      )
    )
    setShowWoundsModal({ show: false, itemId: "" })
  }

  // Handle fractures modal response
  const handleFracturesModalResponse = (hasFractures: boolean) => {
    const { itemId } = showFracturesModal
    setCheckableItems(prev =>
      prev.map(item => 
        item.id === itemId ? { 
          ...item, 
          status: hasFractures ? "critical" : "active" 
        } : item
      )
    )
    setShowFracturesModal({ show: false, itemId: "" })
  }

  const toggleProtocol = (protocolId: string) => {
    const protocol = protocols.find(p => p.id === protocolId)
    if (!protocol || protocol.disabled) return // Don't allow clicking if disabled

    setProtocols(prev =>
      prev.map(p => 
        p.id === protocolId ? { ...p, checked: !p.checked, disabled: true } : p // Disable after clicking
      )
    )

    // Handle special protocol effects
    if (protocolId === "emergency") {
      const isEmergencyChecked = !protocols.find(p => p.id === "emergency")?.checked
      if (isEmergencyChecked) {
        // Show first assignment of each user as critical
        setAssignments(prev => ({
          CAIO: prev.CAIO.map((task, index) => 
            index === 0 ? { ...task, visible: true, status: "critical" as ItemStatus } : task
          ),
          ADRIANO: prev.ADRIANO.map((task, index) => 
            index === 0 ? { ...task, visible: true, status: "critical" as ItemStatus } : task
          ),
          RITA: prev.RITA.map((task, index) => 
            index === 0 ? { ...task, visible: true, status: "critical" as ItemStatus } : task
          ),
        }))
      }
    }

    if (protocolId === "tachydisrithmias") {
      const isTachyChecked = !protocols.find(p => p.id === "tachydisrithmias")?.checked
      if (isTachyChecked) {
        // Make CAIO's 3rd assignment (Prepare drugs) visible
        setAssignments(prev => ({
          ...prev,
          CAIO: prev.CAIO.map((task, index) => 
            index === 2 ? { ...task, visible: true } : task
          )
        }))
      } else {
        // Hide CAIO's 3rd assignment when unchecked
        setAssignments(prev => ({
          ...prev,
          CAIO: prev.CAIO.map((task, index) => 
            index === 2 ? { ...task, visible: false } : task
          )
        }))
      }
    }
  }

  const handleAssignmentClick = (person: Person, taskId: string) => {
    setAssignments(prev => {
      const personTasks = prev[person]
      const taskIndex = personTasks.findIndex(t => t.id === taskId)
      const task = personTasks[taskIndex]
      
      if (!task.visible) return prev

      const updatedTasks = personTasks.map((t, index) => {
        if (t.id === taskId) {
          return { ...t, status: "active" as ItemStatus }
        }
        // Show next task when current task changes from critical to active
        if (index === taskIndex + 1 && task.status === "critical") {
          // Check if it's a drug task and tachydisrithmias is not checked
          if (t.isDrug && !protocols.find(p => p.id === "tachydisrithmias")?.checked) {
            return t // Don't show drug task if tachydisrithmias not checked
          }
          return { ...t, visible: true, status: "critical" as ItemStatus }
        }
        return t
      })

      return { ...prev, [person]: updatedTasks }
    })
  }

  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
      case "active":
        return "bg-[#246E10]"
      case "critical":
        return "bg-[#A61213]"
      default:
        return "bg-[#87868B]"
    }
  }

  const getItemBorderClass = (item: CheckableItem) => {
    return item.system ? "border-2 border-[#B77700]" : ""
  }

  // Filter assignments to show only visible ones, and drug tasks only if tachydisrithmias is checked
  const getVisibleAssignments = (person: Person) => {
    const isTachyChecked = protocols.find(p => p.id === "tachydisrithmias")?.checked
    return assignments[person].filter(task => 
      task.visible && (!task.isDrug || isTachyChecked)
    )
  }

  return (
    <div className="text-white p-6 relative">
      {/* System Modal */}
      {showModal.show && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#87868B] rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-black text-lg font-bold mb-4 text-center">
              Automatic evaluation correct?
            </h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleModalResponse(true)}
                className="bg-[#246E10] text-white px-6 py-2 rounded font-bold hover:opacity-80"
              >
                Yes
              </button>
              <button
                onClick={() => handleModalResponse(false)}
                className="bg-[#A61213] text-white px-6 py-2 rounded font-bold hover:opacity-80"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* True/False Modal for Non-System Items */}
      {showNonSystemModal.show && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#87868B] rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleNonSystemModalResponse(true)}
                className="bg-[#246E10] text-black px-8 py-3 rounded font-bold hover:opacity-80"
              >
                True
              </button>
              <button
                onClick={() => handleNonSystemModalResponse(false)}
                className="bg-[#A61213] text-black px-8 py-3 rounded font-bold hover:opacity-80"
              >
                False
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pupils Modal */}
      {showPupilsModal.show && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#87868B] rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-black text-lg font-bold mb-4 text-center">
              {showPupilsModal.step === 1 ? "Symmetric pupils?" : "Pupils react to light?"}
            </h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handlePupilsModalResponse(true)}
                className="bg-[#246E10] text-black px-8 py-3 rounded font-bold hover:opacity-80"
              >
                True
              </button>
              <button
                onClick={() => handlePupilsModalResponse(false)}
                className="bg-[#A61213] text-black px-8 py-3 rounded font-bold hover:opacity-80"
              >
                False
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wounds Modal */}
      {showWoundsModal.show && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#87868B] rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-black text-lg font-bold mb-4 text-center">
              Wounds?
            </h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleWoundsModalResponse(false)}
                className="bg-[#246E10] text-black px-8 py-3 rounded font-bold hover:opacity-80"
              >
                No
              </button>
              <button
                onClick={() => handleWoundsModalResponse(true)}
                className="bg-[#A61213] text-black px-8 py-3 rounded font-bold hover:opacity-80"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fractures Modal */}
      {showFracturesModal.show && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#87868B] rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-black text-lg font-bold mb-4 text-center">
              Fractures?
            </h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleFracturesModalResponse(false)}
                className="bg-[#246E10] text-black px-8 py-3 rounded font-bold hover:opacity-80"
              >
                No
              </button>
              <button
                onClick={() => handleFracturesModalResponse(true)}
                className="bg-[#A61213] text-black px-8 py-3 rounded font-bold hover:opacity-80"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Grid */}
      <div className="grid grid-cols-5 mb-8 bg-[#151618] rounded-xl h-full">
        {/* Column A */}
        <div className="space-y-3 border-r-3 border-[#79787D] font-bold pb-8">
          <h3 className="text-2xl font-bold text-start p-2 h-12 w-full border-b-3 border-[#79787D]">A</h3>
          {checkableItems.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center space-x-2 px-2">
              <button
                onClick={() => toggleItemStatus(item.id)}
                className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded mr-2 ${getStatusColor(item.status)} ${getItemBorderClass(item)} hover:opacity-80`}
              ></button>
              <span className="text-sm font-bold">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Column B */}
        <div className="space-y-3 border-r-3 border-[#79787D] font-bold pb-8">
          <h3 className="text-2xl font-bold text-start p-2 h-12 w-full border-b-3 border-[#79787D]">B</h3>
          <div className="px-2 space-y-2">
            {checkableItems.slice(3, 9).map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <button
                  onClick={() => toggleItemStatus(item.id)}
                  className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded mr-2 ${getStatusColor(item.status)} ${getItemBorderClass(item)} hover:opacity-80`}
                ></button>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column C */}
        <div className="space-y-3 border-r-3 border-[#79787D] font-bold pb-8">
          <h3 className="text-2xl font-bold text-start p-2 h-12 w-full border-b-3 border-[#79787D]">C</h3>
          <div className="px-2 space-y-2">
            {checkableItems.slice(9, 14).map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <button
                  onClick={() => toggleItemStatus(item.id)}
                  className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded mr-2 ${getStatusColor(item.status)} ${getItemBorderClass(item)} hover:opacity-80`}
                ></button>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column D */}
        <div className="space-y-3 border-r-3 border-[#79787D] font-bold pb-8">
          <h3 className="text-2xl font-bold text-start p-2 h-12 w-full border-b-3 border-[#79787D]">D</h3>
          <div className="px-2 space-y-2">
            {checkableItems.slice(14, 17).map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <button
                  onClick={() => toggleItemStatus(item.id)}
                  className={`!min-w-4 !h-4 rounded mr-2 ${getStatusColor(item.status)} ${getItemBorderClass(item)} hover:opacity-80`}
                ></button>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column E */}
        <div className="space-y-3 font-bold">
          <h3 className="text-2xl font-bold text-start p-2 h-12 w-full border-b-3 border-[#79787D]">E</h3>
          <div className="px-2 space-y-2">
            {checkableItems.slice(17).map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <button
                  onClick={() => toggleItemStatus(item.id)}
                  className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded mr-2 ${getStatusColor(item.status)} ${getItemBorderClass(item)} hover:opacity-80`}
                ></button>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-5 bg-[#151618] rounded-xl h-full">
        {/* Protocols */}
        <div className="space-y-3 p-8 col-span-2 border-r-3 border-[#79787D]">
          <div className="flex items-center justify-between space-x-2 w-full">
            <h3 className="text-xl font-bold">Protocols</h3>
            <Plus className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            {protocols.map((protocol) => (
              <div 
                key={protocol.id} 
                className={`flex items-center justify-between rounded p-2 ${
                  protocol.checked ? 'bg-[#D1546C]' : 'bg-[#D9D9D9]'
                } ${protocol.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={protocol.checked}
                      onChange={() => toggleProtocol(protocol.id)}
                      disabled={protocol.disabled}
                      className="appearance-none w-6 h-6 bg-white border-2 border-gray-300 rounded checked:bg-white checked:border-[#D1546C] focus:outline-none disabled:cursor-not-allowed"
                    />
                    {protocol.checked && (
                      <svg
                        className="absolute top-1 left-1 w-4 h-4 text-[#D1546C] pointer-events-none"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-bold text-black`}>{protocol.name}</span>
                </div>
                <span className={`text-sm font-bold text-black`}>{protocol.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ADRIANO */}
        <div className="space-y-3 col-span-1 p-8">
          <div className="flex items-center space-x-2">
            <Image src="/icons/phone.png" alt="Contact icon" width={32} height={32} className="inline-block w-8 h-8" />
            <h3 className="text-lg font-bold">ADRIANO</h3>
          </div>
          <div className="space-y-2">
            {getVisibleAssignments("ADRIANO").map((task) => (
              <div key={task.id} className="flex items-center space-x-2">
                <button
                  onClick={() => handleAssignmentClick("ADRIANO", task.id)}
                  className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded ${getStatusColor(task.status)} hover:opacity-80`}
                ></button>
                <span className="text-sm">{task.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CAIO */}
        <div className="space-y-3 col-span-1 p-8">
          <div className="flex items-center space-x-2">
            <Image src="/icons/phone.png" alt="Contact icon" width={32} height={32} className="inline-block w-8 h-8" />
            <h3 className="text-lg font-bold">CAIO</h3>
          </div>
          <div className="space-y-2">
            {getVisibleAssignments("CAIO").map((task) => (
              <div key={task.id} className="flex items-center space-x-2">
                <button
                  onClick={() => handleAssignmentClick("CAIO", task.id)}
                  className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded ${getStatusColor(task.status)} hover:opacity-80`}
                ></button>
                <span className="text-sm">{task.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RITA */}
        <div className="space-y-3 col-span-1 p-8">
          <div className="flex items-center space-x-2">
            <Image src="/icons/phone.png" alt="Contact icon" width={32} height={32} className="inline-block w-8 h-8" />
            <h3 className="text-lg font-bold">RITA</h3>
            <span className="bg-white text-[#A61213] text-lg font-bold py-0 flex items-center justify-center rounded-lg ml-4 w-7 aspect-square">TL</span>
          </div>
          <div className="space-y-2">
            {getVisibleAssignments("RITA").map((task) => (
              <div key={task.id} className="flex items-center space-x-2">
                <button
                  onClick={() => handleAssignmentClick("RITA", task.id)}
                  className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded ${getStatusColor(task.status)} hover:opacity-80`}
                ></button>
                <span className="text-sm">{task.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
