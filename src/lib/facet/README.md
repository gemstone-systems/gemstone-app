# facet

`facet` is our internal library for making client apps. Think of it as our version of Tailwind/Nativewind. Yes, it is confusingly clashing with an ATProto text facet, but you can always import it as something else.

## Usage

`facet` provides the following hooks to help make building a consistent design easier.

- `useFacet()`, which provides the entire Facet library object, containing all the values listed below.
- `useVariant()`, which provides a `FacetVariant` object containing the colours defined for our application based on a `FacetPalette` object.
- `useAtoms()`, which provides a `FacetAtoms` object, containing consistent values for shadows, borders, radii, layout, and positioning.
- `useTypography()`, which provides a `FacetTypography` object, containing consistent values for all things text-related.

`facet` also exports a provider, the `FacetProvider`, which must be wrapped around the root of your application (or similar) to access the values.

## Setup

1. Create a new `Facet` by calling the generator and providing any options in the shape of a `FacetOpts` object. `const facet = generateFacet()`.
2. Provide the `Facet` as a prop to the `FacetProvider`. `<FacetProvider facet={facet}>...</FacetProvider>`
3. Use the hooks elsewhere in your application.

## Configuration

If no options object is passed to the `Facet` constructor, it will use the values defined for Gemstone's client app. In general, any value not passed in the initial constructor object will be replaced with these values as well.
