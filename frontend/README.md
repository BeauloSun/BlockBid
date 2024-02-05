# To do (Frontend)

## Testing commands:

1. General commands:

```shell
yarn test
yarn coverage (statement cov, branch cov, function cov, lines cov)
```

2. Report writing:
   For only detect coverage from specific file: (example)
   adding in package.json scripts

```shell
--collectCoverageFrom='src/components/*.jsx'
--collectCoverageFrom='!src/components/*.jsx'
```

## Pages:

1. Landing page
2. Wallet page + Metamask API
3. Minting page: Img upload, Name, Description, Mint Button\*\*
4. User profile: Manage owned NFTs, wallets
5. Marketplace: Display minted NFT

## Components:

1. Header √
2. Footer √

# How to add a new page:

1. Create a <new_page>.js in "pages" folder, and it must follow this fomat:

```shell
export const PageName = () => {
  return (
    <div>
    # Your code
    </div>
  );
};
```

2. App.js is the central page manager, go into App.js and add lines:

```shell
import { <Your page> } from "./pages/<Your page>";
```

and also add a link:

```shell
<Route path="<Your desired path>" element={<Page_name />} />
```

3. Whenever you want to create a link to the new page:

```shell
<Link to="/<The path just set>">
    <Link name>
</Link>
```

If it's a button:

```shell
<Link to="/<Your Path>">
<button>
#Your button content
</button>
</Link>
```
