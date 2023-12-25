import Container from "./Container"
import HeaderETC from "./HeaderETC"
import HeaderIcon from "./HeaderIcon"
import HeaderSearch from "./HeaderSearch"

export default function Header() {
  return (
    <Container className="bg-yellow-200">
      <nav className="w-full grid grid-cols-3">
        <HeaderIcon />
        <HeaderSearch />
        <HeaderETC />
      </nav>
    </Container>
  )
}
