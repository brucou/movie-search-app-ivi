import { div, a, ul, li, input, h1, h3, legend, img, dl, dt, dd, VALUE } from "ivi-html";
import { _, Events, onClick, onInput, TrackByKey, key } from "ivi";
import {
  testIds,
  events,
  screens as screenIds,
  NETWORK_ERROR,
  POPULAR_NOW,
  PROMPT,
  IMAGE_TMDB_PREFIX,
  LOADING,
  SEARCH_RESULTS_FOR
} from "./properties";

const {
  PROMPT_TESTID,
  RESULTS_HEADER_TESTID,
  RESULTS_CONTAINER_TESTID,
  QUERY_FIELD_TESTID,
  MOVIE_IMG_SRC_TESTID,
  MOVIE_TITLE_TESTID,
  NETWORK_ERROR_TESTID
} = testIds;
const { QUERY_RESETTED, QUERY_CHANGED, MOVIE_DETAILS_DESELECTED, MOVIE_SELECTED } = events;
const {
  LOADING_SCREEN,
  SEARCH_ERROR_SCREEN,
  SEARCH_RESULTS_AND_LOADING_SCREEN,
  SEARCH_RESULTS_SCREEN,
  SEARCH_RESULTS_WITH_MOVIE_DETAILS,
  SEARCH_RESULTS_WITH_MOVIE_DETAILS_AND_LOADING_SCREEN,
  SEARCH_RESULTS_WITH_MOVIE_DETAILS_ERROR
} = screenIds;

const eventHandlersFactory = next => ({
  [QUERY_CHANGED]: onInput(ev => next({ [QUERY_CHANGED]: ev.native.target.value })),
  [QUERY_RESETTED]: onClick(() => next({ [QUERY_CHANGED]: "" })),
  [MOVIE_SELECTED]: (ev, result) => next({ [MOVIE_SELECTED]: { movie: result } }),
  [MOVIE_DETAILS_DESELECTED]: onClick(() => next({ [MOVIE_DETAILS_DESELECTED]: void 0 }))
});

const App = (page, children) =>
  div("App uk-light uk-background-secondary", { "data-active-page": page }, children);
const Container = children => div("App__view-container", _, children);
const AppView = (page, children) =>
  div(
    "App__view uk-margin-top-small uk-margin-left uk-margin-right",
    { "data-page": page },
    children
  );
const Legend = legend("uk-legend", { "data-testid": PROMPT_TESTID }, PROMPT);

const SearchBar = (eventHandlers, query) =>
  div("SearchBar uk-inline uk-margin-bottom", _, [
    Events(
      eventHandlers[QUERY_RESETTED],
      a("uk-form-icon uk-form-icon-flip js-clear", {
        "uk-icon": query.length > 0 ? "icon:close" : "icon:search"
      })
    ),
    Events(
      eventHandlers[QUERY_CHANGED],
      input("SearchBar__input uk-input js-input", {
        type: "text",
        value: VALUE(query),
        "data-testid": QUERY_FIELD_TESTID
      })
    )
  ]);

const TopBar = (eventHandlers, query) => [
  h1(_, _, `TMDb UI – Home`),
  Legend,
  SearchBar(eventHandlers, query),
  h3(
    "uk-heading-bullet uk-margin-remove-top",
    { "data-testid": RESULTS_HEADER_TESTID },
    query.length === 0 ? POPULAR_NOW : SEARCH_RESULTS_FOR(query)
  )
];

const ResultsContainer = children =>
  div("ResultsContainer", { "data-testid": RESULTS_CONTAINER_TESTID }, children);

const Results = (eventHandlers, results) =>
  ul(
    "uk-thumbnav",
    _,
    TrackByKey(
      results
        ? results
          .filter(result => result.backdrop_path)
          .map(result =>
            key(
              result.id,
              li(
                "uk-margin-bottom",
                _,
                Events(
                  onClick(ev => eventHandlers[MOVIE_SELECTED](ev, result)),
                  a(
                    "ResultsContainer__result-item js-result-click",
                    { href: "#", "data-id": result.id },
                    [
                      div(
                        "ResultsContainer__thumbnail-holder",
                        _,
                        img(_, {
                          src: `${IMAGE_TMDB_PREFIX}${result.backdrop_path}`,
                          alt: "",
                          "data-testid": MOVIE_IMG_SRC_TESTID
                        })
                      ),
                      div(
                        "ResultsContainer__caption uk-text-small uk-text-muted",
                        { "data-testid": MOVIE_TITLE_TESTID },
                        result.title
                      )
                    ]
                  )
                )
              )
            )
          )
        : null
    )
  );

const Desc = (t, d) => [dt(_, _, t), dd(_, _, d)];

export const screens = next => {
  const eventHandlers = eventHandlersFactory(next);

  return {
    [LOADING_SCREEN]: () =>
      App(
        "home",
        Container(
          AppView(
            "home",
            div("HomePage", _, [TopBar(eventHandlers, ""), ResultsContainer(div(_, _, LOADING))])
          )
        )
      ),
    [SEARCH_RESULTS_SCREEN]: ({ results, query }) =>
      App(
        "home",
        Container(
          AppView(
            "home",
            div("HomePage", _, [
              TopBar(eventHandlers, query),
              ResultsContainer(Results(eventHandlers, results))
            ])
          )
        )
      ),
    [SEARCH_ERROR_SCREEN]: ({ query }) =>
      App(
        "home",
        Container(
          AppView(
            "home",
            div("HomePage", _, [
              TopBar(eventHandlers, query),
              ResultsContainer(div(_, { "data-testid": NETWORK_ERROR_TESTID }, NETWORK_ERROR))
            ])
          )
        )
      ),
    [SEARCH_RESULTS_AND_LOADING_SCREEN]: ({ results, query }) =>
      App(
        "home",
        Container(
          AppView(
            "home",
            div("HomePage", _, [TopBar(eventHandlers, query), ResultsContainer(div(_, _, LOADING))])
          )
        )
      ),
    [SEARCH_RESULTS_WITH_MOVIE_DETAILS_AND_LOADING_SCREEN]: ({ results, query, title }) =>
      App(
        "item",
        Container([
          AppView(
            "home",
            div("HomePage", _, [
              TopBar(eventHandlers, query),
              ResultsContainer(Results(eventHandlers, results))
            ])
          ),
          AppView("item", div(_, _, [h1(_, _, title), div(_, _, LOADING)]))
        ])
      ),
    [SEARCH_RESULTS_WITH_MOVIE_DETAILS]: ({ results, query, details, cast }) =>
      App(
        "item",
        Events(
          eventHandlers[MOVIE_DETAILS_DESELECTED],
          Container([
            AppView(
              "home",
              div("HomePage", _, [
                TopBar(eventHandlers, query),
                ResultsContainer(Results(eventHandlers, results))
              ])
            ),
            AppView(
              "item",
              div(_, _, [
                h1(_, _, details.title || ""),
                div("MovieDetailsPage", _, [
                  div(
                    "MovieDetailsPage__img-container uk-margin-right",
                    { style: { float: "left" } },
                    img(_, {
                      src: `http://image.tmdb.org/t/p/w342${details.poster_path}`,
                      alt: ""
                    })
                  ),
                  dl("uk-description-list", _, [
                    Desc("Popularity", details.vote_average),
                    Desc("Overview", details.overview),
                    Desc("Genres", details.genres.map(g => g.name).join(", ")),
                    Desc(
                      "Starring",
                      cast.cast
                        .slice(0, 3)
                        .map(cast => cast.name)
                        .join(", ")
                    ),
                    Desc("Languages", details.spoken_languages.map(g => g.name).join(", ")),
                    Desc("Original Title", details.original_title),
                    Desc("Release Date", details.release_date),
                    details.imdb_id
                      ? Desc(
                      "IMDb URL",
                      a(
                        _,
                        { href: `https://www.imdb.com/title/${details.imdb_id}/` },
                        `https://www.imdb.com/title/${details.imdb_id}/`
                      )
                      )
                      : null
                  ])
                ])
              ])
            )
          ])
        )
      ),
    [SEARCH_RESULTS_WITH_MOVIE_DETAILS_ERROR]: ({ results, query, title }) =>
      App(
        "item",
        Events(
          eventHandlers[MOVIE_DETAILS_DESELECTED],
          Container([
            AppView(
              "home",
              div("HomePage", _, [
                TopBar(eventHandlers, query),
                ResultsContainer(Results(eventHandlers, results))
              ])
            ),
            AppView(
              "item",
              div(_, _, [
                h1(_, _, title),
                div(_, { "data-testid": NETWORK_ERROR_TESTID }, NETWORK_ERROR)
              ])
            )
          ])
        )
      )
  };
};
