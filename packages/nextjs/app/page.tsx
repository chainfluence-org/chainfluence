import Link from "next/link";

export default function Page() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Link href="/projects/create">
        <button style={{ marginBottom: "30px", backgroundColor: "#0070f3", padding: "10px", width: "100px" }}>
          CREATE
        </button>
      </Link>
      <Link href="/projects/explore">
        <button style={{ backgroundColor: "#0070f3", padding: "10px", width: "100px" }}>EXPLORE</button>
      </Link>
    </div>
  );
}
