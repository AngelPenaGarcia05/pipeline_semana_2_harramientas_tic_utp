import { Rainbow } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-left">
        <div className="flex items-center gap-2">
          <Rainbow className="h-5 w-5 text-blue-500" />
          <span className="font-bold text-gray-800">Juguetería Arcoíris</span>
        </div>
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Juguetería Arcoíris · Juguetes para soñar y jugar
        </p>
      </div>
    </footer>
  )
}