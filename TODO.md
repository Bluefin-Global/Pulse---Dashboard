# Winston Command — Development To-Do

## Planned: Stock market heat map (Schwab data)

- [ ] Add an interactive **stock market heat map** within Winston Command's Markets / command-center interface.
- [ ] Use authorized Schwab market-data API access where permitted; confirm available quote coverage, entitlements, rate limits, and display/redistribution licensing before implementation.
- [ ] Support configurable universe (e.g., S&P 500 or watchlist), sector grouping, and tile sizing by market capitalization or another clearly labeled metric when available.
- [ ] Color tiles by daily percentage change, with accessible positive/negative/neutral legend, ticker and company labels, hover details, and click-through to the stock's detail/quote panel.
- [ ] Include refresh timestamp, delayed/live indication, loading/error/stale-data states; never invent prices or imply that delayed data is real time.
- [ ] Implement secure server-side data aggregation/caching and avoid exposing Schwab credentials in the browser.
- [ ] Test layout, mobile behavior, authorization, and API quota usage before release.

**Status:** Backlog / not yet implemented. Existing Schwab quote work does not establish entitlement to bulk heat-map data.
