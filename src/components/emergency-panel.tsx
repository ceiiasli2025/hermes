"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import Image from "next/image"

type ItemStatus = "inactive" | "active" | "critical"
type Person = "REID" | "VICTOR" | "CHRISTINA"

interface Task {
  id: string
  text: string
  status: ItemStatus
  assignedTo?: Person
}

interface CheckableItem {
  id: string
  text: string
  status: ItemStatus
}

export default function EmergencyPanel() {
  const [checkableItems, setCheckableItems] = useState<CheckableItem[]>([
    { id: "clear-airways", text: "Clear airways", status: "inactive" },
    { id: "able-speak", text: "Able to speak/cough", status: "inactive" },
    { id: "alert", text: "Alert", status: "inactive" },
    { id: "reacts-voice", text: "Reacts to voice, pain or unconsciousness", status: "inactive" },
    { id: "pupils-reaction", text: "Pupils reaction", status: "inactive" },
    { id: "sign-injuries", text: "Sign of injuries (wounds, fractures, etc)", status: "inactive" },
    { id: "spacesuit-state", text: "Spacesuit state", status: "inactive" },
    { id: "difficulty-breathing", text: "Difficulty breathing", status: "inactive" },
    { id: "severe-bleeding", text: "Severe visible bleeding", status: "inactive" },
  ])

  const [procedures, setProcedures] = useState<Task[]>([
    { id: "advise-calm", text: "Advise astronaut to stay calm", status: "active" },
    { id: "abort-eva", text: "Abort EVA", status: "active" },
    { id: "contact-astronaut", text: "Contact closest astronaut", status: "active" },
    { id: "emergency-oxygen", text: "Switch to emergency oxygen source", status: "active" },
    { id: "give-first-aid", text: "Give first aid", status: "active" },
    { id: "send-rover", text: "Send Rover", status: "active" },
    { id: "prepare-infirmary", text: "Prepare infirmary", status: "active" },
  ])

  const [assignments, setAssignments] = useState({
    REID: [
      { id: "reid-1", text: "Abort EVA", status: "active" as ItemStatus },
      { id: "reid-2", text: "Give first aid", status: "critical" as ItemStatus },
    ],
    VICTOR: [
      { id: "victor-1", text: "Prepare infirmary", status: "active" as ItemStatus },
      { id: "victor-2", text: "Saline solution", status: "active" as ItemStatus },
      { id: "victor-3", text: "Atropine", status: "active" as ItemStatus },
      { id: "victor-4", text: "Adrenaline", status: "critical" as ItemStatus },
    ],
    CHRISTINA: [
      { id: "christina-1", text: "Prepare defibrillator", status: "active" as ItemStatus },
      { id: "christina-2", text: "Prepare ECG", status: "active" as ItemStatus },
      { id: "christina-3", text: "Prepare ventilator", status: "critical" as ItemStatus },
      { id: "christina-4", text: "Prepare oxymeter", status: "critical" as ItemStatus },
    ],
  })

  const [assignedTasks, setAssignedTasks] = useState<Set<string>>(new Set())

  const toggleItemStatus = (id: string) => {
    setCheckableItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.status === "inactive") {
            // Only update status here, add procedure outside
            return { ...item, status: "active" }
          } else {
            // Toggle between active and critical only
            const nextStatus = item.status === "active" ? "critical" : "active"
            // Update corresponding procedures
            setProcedures((prev) =>
              prev.map((proc) => (proc.text === item.text ? { ...proc, status: nextStatus } : proc)),
            )
            // Update corresponding assignments
            setAssignments((prev) => ({
              REID: prev.REID.map((task) => (task.text === item.text ? { ...task, status: nextStatus } : task)),
              VICTOR: prev.VICTOR.map((task) => (task.text === item.text ? { ...task, status: nextStatus } : task)),
              CHRISTINA: prev.CHRISTINA.map((task) =>
                task.text === item.text ? { ...task, status: nextStatus } : task,
              ),
            }))
            return { ...item, status: nextStatus }
          }
        }
        return item
      }),
    )
    // Add procedure only if status was inactive
    const item = checkableItems.find((i) => i.id === id)
    if (item && item.status === "inactive") {
      const alreadyExists = procedures.some((proc) => proc.text === item.text)
      if (!alreadyExists) {
        const newTask: Task = {
          id: `proc-${Date.now()}`,
          text: item.text,
          status: "active",
        }
        setProcedures((prev) => [...prev, newTask])
      }
    }
  }

  const autoAssignTask = (taskId: string) => {
    const task = procedures.find((p) => p.id === taskId)
    if (!task || assignedTasks.has(taskId)) return

    // Modified to remove capacity limits
    // Assign to the person with the fewest tasks
    const people: Person[] = ["REID", "VICTOR", "CHRISTINA"]

    // Find the person with the fewest tasks
    let personWithFewestTasks: Person = "REID"
    let fewestTasks = assignments.REID.length

    if (assignments.VICTOR.length < fewestTasks) {
      personWithFewestTasks = "VICTOR"
      fewestTasks = assignments.VICTOR.length
    }

    if (assignments.CHRISTINA.length < fewestTasks) {
      personWithFewestTasks = "CHRISTINA"
    }

    // Assign to the person with the fewest tasks
    const newAssignment = {
      id: `${personWithFewestTasks.toLowerCase()}-${Date.now()}`,
      text: task.text,
      status: task.status,
    }

    setAssignments((prev) => ({
      ...prev,
      [personWithFewestTasks]: [...prev[personWithFewestTasks], newAssignment],
    }))

    setAssignedTasks((prev) => new Set(prev).add(taskId))
  }

  const toggleAssignedTaskStatus = (person: Person, taskId: string) => {
    setAssignments((prev) => ({
      ...prev,
      [person]: prev[person].map((task) => {
        if (task.id === taskId) {
          const nextStatus = task.status === "active" ? "critical" : "active"

          // Update corresponding procedures
          setProcedures((prevProc) =>
            prevProc.map((proc) => (proc.text === task.text ? { ...proc, status: nextStatus } : proc)),
          )

          // Update corresponding checkable items
          setCheckableItems((prevItems) =>
            prevItems.map((item) => (item.text === task.text ? { ...item, status: nextStatus } : item)),
          )

          // Update other assignments with the same text
          setAssignments((prevAssign) => ({
            REID: prevAssign.REID.map((t) => (t.text === task.text ? { ...t, status: nextStatus } : t)),
            VICTOR: prevAssign.VICTOR.map((t) => (t.text === task.text ? { ...t, status: nextStatus } : t)),
            CHRISTINA: prevAssign.CHRISTINA.map((t) => (t.text === task.text ? { ...t, status: nextStatus } : t)),
          }))

          return { ...task, status: nextStatus }
        }
        return task
      }),
    }))
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

  return (
    <div className="text-white p-6">
      {/* Header Grid */}
      <div className="grid grid-cols-5 mb-8 bg-[#151618] rounded-xl h-full">
        {/* Column A */}
        <div className="space-y-3 border-r-3  border-[#79787D] font-bold pb-8">
          <h3 className="text-2xl font-bold text-start p-2 h-12 w-full border-b-3  border-[#79787D]">A</h3>
          {checkableItems.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center space-x-2 px-2">
              <button
                onClick={() => toggleItemStatus(item.id)}
                className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded mr-2 ${getStatusColor(item.status)}`}
              ></button>
              <span className="text-sm font-bold">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Column B */}
        <div className="space-y-3 border-r-3  border-[#79787D] font-bold pb-8">
          <h3 className="text-2xl font-bold text-start p-2 h-12 w-full border-b-3  border-[#79787D]">B</h3>
          <div className="px-2">
            <h4 className="text-[#58B0D9] font-semibold">Breathing Rate:</h4>
            <div className="space-y-2 text-sm py-2">
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-[#A61213] rounded mr-2"></span>Normal (12-20)
              </div>
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-[#A61213] rounded mr-2"></span>Tachypnea ({">"} 20)
              </div>
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-[#246E10] rounded mr-2"></span>Bradypnea ({"<"} 12)
              </div>
            </div>
            <div className="mt-3 flex items-center space-x-2">
              <button
                onClick={() => toggleItemStatus("difficulty-breathing")}
                className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded mr-2 ${getStatusColor(checkableItems.find((i) => i.id === "difficulty-breathing")?.status || "inactive")}`}
              ></button>
              <span className="text-sm">Difficulty breathing</span>
            </div>
          </div>
        </div>

        {/* Column C */}
        <div className="space-y-3 border-r-3  border-[#79787D] font-bold pb-8">
          <h3 className="text-2xl font-bold text-start p-2 h-12 w-full border-b-3  border-[#79787D]">C</h3>
          <div className="px-2">
            <h4 className="text-[#58B0D9] font-semibold">Heart Rate:</h4>
            <div className="space-y-2 text-sm py-2">
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-[#A61213] rounded mr-2"></span>Normal (60-100)
              </div>
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-[#A61213] rounded mr-2"></span>Tachycardia ({">"} 100)
              </div>
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-[#246E10] rounded mr-2"></span>Bradycardia ({"<"} 60)
              </div>
            </div>
          </div>
          <div className="mt-3 px-2">
            <h4 className="text-[#58B0D9] font-semibold">Blood Pressure:</h4>
            <div className="space-y-2 text-sm py-2">
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-[#A61213] rounded mr-2"></span>Normal
              </div>
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-[#A61213] rounded mr-2"></span>Hypertension (140/90)
              </div>
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-[#246E10] rounded mr-2"></span>Hypotension (90/60)
              </div>
            </div>
            <div className="mt-3 flex items-center space-x-2">
              <button
                onClick={() => toggleItemStatus("severe-bleeding")}
                className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded mr-2 ${getStatusColor(checkableItems.find((i) => i.id === "severe-bleeding")?.status || "inactive")}`}
              ></button>
              <span className="text-sm">Severe visible bleeding</span>
            </div>
          </div>
        </div>

        {/* Column D */}
        <div className="space-y-3 border-r-3  border-[#79787D] font-bold pb-8">
          <h3 className="text-2xl font-bold text-start p-2 h-12 w-full border-b-3  border-[#79787D]">D</h3>
          <div className="px-2">
            <h4 className="text-white font-semibold">Consciousness (AVPU)</h4>
            {checkableItems.slice(2, 5).map((item) => (
              <div key={item.id} className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => toggleItemStatus(item.id)}
                  className={`!min-w-4 !h-4 rounded mr-2 ${getStatusColor(item.status)}`}
                ></button>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 px-2">
            <h4 className="text-blue-400 font-semibold">Glucose level:</h4>
            <div className="space-y-2 text-sm py-2">
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-[#246E10] rounded mr-2"></span>Normal
              </div>
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-red-500 rounded mr-2"></span>Hyperglycemia ({">"} 126?)
              </div>
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-red-500 rounded mr-2"></span>Hypoglycemia ({"<"} 70)
              </div>
            </div>
          </div>
        </div>

        {/* Column E */}
        <div className="space-y-3 font-bold">
          <h3 className="text-2xl font-bold text-start p-2 h-12 w-full border-b-3  border-[#79787D]">E</h3>
          <div className="px-2">
            <h4 className="text-[#58B0D9] font-semibold">Temperature:</h4>
            <div className="space-y-2 text-sm py-2">
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-[#246E10] rounded mr-2"></span>Normal
              </div>
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-red-500 rounded mr-2"></span>Hyperthermia ({">"} 40°C)
              </div>
              <div className="flex items-center text-[#58B0D9]">
                <span className="!w-4 !h-4 !min-w-4 !min-h-4 bg-red-500 rounded mr-2"></span>Hypothermia ({"<"} 35°C)
              </div>
            </div>
          </div>
          {checkableItems.slice(5).map((item) => (
            <div key={item.id} className="flex items-center space-x-2 px-2">
              <button
                onClick={() => toggleItemStatus(item.id)}
                className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded mr-2 ${getStatusColor(item.status)}`}
              ></button>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-5 bg-[#151618] rounded-xl h-full">
        {/* Procedures & Tasks */}
        <div className="space-y-3 p-8 col-span-2 border-r-3 border-[#79787D]">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold">PROCEDURES & TASKS</h3>
            <Plus className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            {procedures.map((task) => (
              <div key={task.id} className="flex items-center space-x-2">
                <span className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded ${getStatusColor(task.status)}`}></span>
                <button
                  onClick={() => autoAssignTask(task.id)}
                  className="text-sm flex-1 text-left hover:bg-gray-800 px-1 py-1 rounded"
                >
                  {task.text}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* REID */}
        <div className="space-y-3 col-span-1 p-8">
          <div className="flex items-center space-x-2">
            <Image src="/icons/phone.png" alt="Contact icon" width={48} height={48} className="inline-block w-8 h-8" />
            <h3 className="text-lg font-bold">REID: {assignments.REID.filter(task => task.status === "active").length}/2</h3>
          </div>
          <div className="space-y-2">
            {assignments.REID.map((task) => (
              <div key={task.id} className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAssignedTaskStatus("REID", task.id)}
                  className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded ${getStatusColor(task.status)} hover:opacity-80`}
                ></button>
                <span className="text-sm">{task.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* VICTOR */}
        <div className="space-y-3 col-span-1 p-8">
          <div className="flex items-center space-x-2">
            <Image src="/icons/phone.png" alt="Contact icon" width={48} height={48} className="inline-block w-8 h-8" />
            <h3 className="text-lg font-bold">VICTOR: {assignments.VICTOR.filter(task => task.status === "active").length}/4</h3>
          </div>
          <div className="space-y-2">
            {assignments.VICTOR.map((task) => (
              <div key={task.id} className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAssignedTaskStatus("VICTOR", task.id)}
                  className={`!w-4 !h-4 !min-w-4 !min-h-4 rounded ${getStatusColor(task.status)} hover:opacity-80`}
                ></button>
                <span className="text-sm">{task.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHRISTINA */}
        <div className="space-y-3 col-span-1 p-8">
          <div className="flex items-center space-x-2">
            <Image src="/icons/phone.png" alt="Contact icon" width={48} height={48} className="inline-block w-8 h-8" />
            <h3 className="text-lg font-bold">CHRISTINA: {assignments.CHRISTINA.filter(task => task.status === "active").length}/4</h3>
          </div>
          <div className="space-y-2">
            {assignments.CHRISTINA.map((task) => (
              <div key={task.id} className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAssignedTaskStatus("CHRISTINA", task.id)}
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
