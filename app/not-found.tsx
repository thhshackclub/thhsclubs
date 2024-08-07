export default function NotFound() {
  return (
    <>
      <h1>Page Not Found</h1>

      <div id="timestamp">{Date.now()}</div>
    </>
  );
}

NotFound.displayName = "NotFound";
