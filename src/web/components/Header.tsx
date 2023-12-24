import HeaderETC from "./HeaderETC"
import HeaderIcon from "./HeaderIcon"
import HeaderSearch from "./HeaderSearch"

export default function Header() {
  return (
    <nav className="w-screen grid grid-cols-3">
      <HeaderIcon />
      <HeaderSearch />
      <HeaderETC />
    </nav>
  )
}
