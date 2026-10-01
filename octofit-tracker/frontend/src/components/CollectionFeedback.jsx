function CollectionFeedback({ loading, error, items, onRetry, emptyTitle, emptyMessage, children }) {
  if (loading) {
    return <div className="collection-message" role="status"><span className="loading-mark" aria-hidden="true" />Loading your OctoFit data...</div>
  }
  if (error) {
    return (
      <div className="collection-message collection-error" role="alert">
        <div><strong>Could not reach the API</strong><p>{error}</p></div>
        <button className="quiet-button" onClick={onRetry} type="button">Try again</button>
      </div>
    )
  }
  if (!items.length) {
    return <div className="collection-message empty-message"><strong>{emptyTitle}</strong><p>{emptyMessage}</p></div>
  }
  return children
}

export default CollectionFeedback