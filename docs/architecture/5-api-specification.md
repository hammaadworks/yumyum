# Section 5 of 18: API Specification (v2)

Our API is the auto-generated REST API provided by Supabase. Our formal policy is to interact with this API _exclusively_ through the `@supabase/supabase-js` client library.

- **Interaction Method:** Supabase Client Library (`@supabase/supabase-js`)
- **Rationale:** This is a pragmatic and opinionated choice. Using the client library provides a clean, typed, and consistent interface for all data access. It abstracts away the raw HTTP requests, reduces boilerplate, handles JWT token management automatically, and is the most robust way to work with Supabase. We will _not_ make direct HTTP requests to the PostgREST endpoints.

## Example Usage (via Supabase Client)

- **Create a new dish:**

  ```typescript
  const { data, error } = await supabase
    .from('dishes')
    .insert({ vendor_id: '...', name: 'New Pizza', ... });
  ```

- **Read all dishes for a vendor:**

  ```typescript
  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .eq('vendor_id', '...');
  ```

- **Update a dish:**

  ```typescript
  const { data, error } = await supabase
    .from('dishes')
    .update({ price: 15.99 })
    .eq('id', 123);
  ```

- **Delete a dish:**
  ```typescript
  const { data, error } = await supabase.from('dishes').delete().eq('id', 123);
  ```

---
