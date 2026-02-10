# Letrus Care App - Copilot Instructions

## Project Overview
This is an Electron desktop application built with React, TypeScript, and Vite for managing literacy center operations. It provides a rich UI for enrollment management, student tracking, payments, and reporting.

## Technology Stack
- **Desktop Framework:** Electron 31+
- **Language:** TypeScript 5.5+
- **Frontend Framework:** React 18.3+ with React Hooks
- **Build Tool:** Electron-Vite 2.3+
- **Bundler:** Vite 5.3+
- **Styling:** Tailwind CSS 3.4+
- **State Management:** React Context API + TanStack Query (React Query v5)
- **Forms:** React Hook Form + Yup validation
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **PDF Generation:** @react-pdf/renderer
- **Icons:** Lucide React
- **Notifications:** SweetAlert2

## General Guidelines
- **Language Version:** Use TypeScript with ES2022+ features
- **Module System:** Use ES modules (`import`/`export`)
- **Code Style:** Keep code simple, readable, and type-safe
- **Error Handling:** Use `try/catch` blocks for asynchronous operations
- **Component Pattern:** Use functional components with React Hooks exclusively
- **Always follow responsive design principles for desktop first such refactoring**
- **Type Safety:** Leverage TypeScript; avoid `any` types


## Naming Conventions
- **Variables/Functions/Hooks:** Use `camelCase` (e.g., `useState`, `handleSubmit`)
- **Constants:** Use `ALL_CAPS` for true constants and environment variables
- **Components:** Use `PascalCase` (e.g., `StudentSidebar`, `EnrollmentTable`)
- **Interfaces/Types:** Use `PascalCase` with `I` prefix for interfaces (e.g., `IStudent`, `IEnrollment`)
- **Files:** Use `PascalCase` for component files, `kebab-case` for utilities
- **Folders:** Use `PascalCase` for component folders, lowercase for utilities

## Project Architecture

### Folder Structure
```
src/
├── main/              # Electron main process
├── preload/           # Electron preload scripts
└── renderer/          # React application
    ├── public/        # Static assets
    └── src/
        ├── assets/    # Fonts, images
        ├── components/# Reusable UI components
        ├── contexts/  # React Context providers
        ├── hooks/     # Custom React hooks
        │   └── queries/# React Query hooks
        ├── lib/       # Library configurations
        ├── reports/   # PDF generation components
        ├── Routes/    # Route definitions
        ├── screens/   # Page-level components
        ├── services/  # API service layer
        ├── types/     # TypeScript type definitions
        └── utils/     # Utility functions
```

### Architectural Patterns

#### 1. Component-Based Architecture
- **Screens:** Top-level page components (e.g., `EnrollmentScreen`)
- **Components:** Reusable UI elements (e.g., `Modal`, `Pagination`)
- **Shared Components:** Common components in `components/shared/`

#### 2. Service Layer Pattern
- All API calls abstracted in `services/` directory
- Services return typed responses
- Use Axios instance with credentials enabled

#### 3. React Query Pattern (TanStack Query)
- Centralized data fetching and caching
- Custom hooks in `hooks/queries/`
- Query keys organized by entity
- Automatic cache invalidation on mutations
- use customized queryClient with sensible defaults (e.g., no refetch on window focus, 5-minute stale time) defined on /lib/react-query.ts

#### 4. Context + Hooks Pattern
- Global state management via React Context
- Custom hooks for context consumption (e.g., `useAuth()`, `useCenter()`,`useSchoolYear()`)
- Context providers wrap app at root level

## Code Patterns and Best Practices

### React Components
```tsx
// Always use React.FC with explicit typing
export const StudentSidebar: React.FC<SidebarProps> = ({ isOpen, enrollmentId }) => {
  // Hooks first
  const [loading, setLoading] = useState(false);
  const { data } = useEnrollmentQuery(enrollmentId);

  // Event handlers
  const handleClose = (): void => {
    // implementation
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

**Component Best Practices:**
- Use `React.FC` type for functional components
- Define prop interfaces above component
- Order hooks before other logic
- Extract event handlers as named functions
- Use descriptive names for state variables
- Always provide explicit return types for functions
- Use conditional rendering with ternary operators or `&&`

### React Query Hooks
```typescript
// Query Keys
export const enrollmentKeys = {
  all: ['enrollments'] as const,
  list: (centerId: string, page: number, query?: string) =>
    [...enrollmentKeys.all, 'list', centerId, page, query] as const,
  detail: (id: string) => [...enrollmentKeys.all, 'detail', id] as const
}

// Query Hook
export const useEnrollmentsQuery = (
  centerId?: string,
  page: number = 1,
  query: string = ''
): UseQueryResult<IEnrollmentForShow[], unknown> => {
  return useQuery({
    queryKey: enrollmentKeys.list(centerId ?? '', page, query),
    queryFn: async () => {
      if (!centerId) throw new Error('Center ID required')
      if (query) {
        return searchEnrollmentsService(centerId, query)
      }
      return getEnrollmentsService(centerId, page)
    },
    enabled: !!centerId,
    placeholderData: (previousData) => previousData
  })
}

// Mutation Hook
import { queryClient } from '@renderer/lib/react-query'
export const useCreateEnrollmentMutation = (): UseMutationResult<IEnrollmentForShow, unknown, IEnrollmentForApply> => {
  return useMutation({
    mutationFn: (data: IEnrollmentForApply) => createEnrollment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all })
    }
  })
}
```

**React Query Best Practices:**
- Define query keys as constants with factory functions
- Use `as const` for query keys to ensure type safety
- Always invalidate related queries after mutations
- Use `enabled` option for conditional queries
- Provide default parameter values
- Use `placeholderData` for smooth pagination
- Return explicit types (`UseQueryResult<all data returned>`, `UseMutationResult<all data returned>`)

### Service Layer
```typescript
export const createEnrollment = async (data: IEnrollmentForApply): Promise<IEnrollmentForShow> => {
  const {
    name,
    birthDate,
    // ... destructure needed fields
  } = data

  const response = await apiManager.post('/enrollments/new', {
    // ... request body
  })

  return response.data
}
```

**Service Best Practices:**
- Use named exports for service functions
- Always type input parameters and return values
- Use Axios instance (`apiManager`) for all requests
- Destructure input data for clarity
- Return only the data portion from responses
- Handle errors at the component/hook level, not in services

### Context Providers
```tsx
interface AuthContextData {
  signed: boolean;
  loading: boolean;
  user: IAuth | null;
  login: (data: IAuth) => Promise<IAuth | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IAuth | null>(null)

  // ... implementation

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext)
  return context
}
```

**Context Best Practices:**
- Define explicit interface for context data
- Export both Provider and custom hook
- Use `ReactNode` for children prop
- Handle loading and error states
- Persist state to sessionStorage when appropriate
- Name custom hooks with `use` prefix

### Form Handling
```tsx
const schema = yup
  .object({
    name: yup.string().required('Preencha o Nome'),
    email: yup.string().email('Email Inválido'),
  })
  .required()

type FormData = yup.InferType<typeof schema>

export const MyForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      await submitService(data)
      // Show success message
    } catch (error) {
      // Show error message
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
    </form>
  )
}
```

**Form Best Practices:**
- Use Yup for validation schemas
- Infer types from Yup schema using `yup.InferType`
- Use `yupResolver` for React Hook Form integration
- Destructure only needed form methods
- Always provide error messages in Portuguese
- Show validation errors near inputs
- Use async handlers with proper error handling

### User Feedback
```tsx
// Success notification
Swal.fire({
  position: 'bottom-end',
  icon: 'success',
  title: 'Operação realizada com sucesso!',
  showConfirmButton: false,
  timer: 2000,
  customClass: {
    popup: 'h-44 p-2',
    title: 'text-sm',
    icon: 'text-xs'
  },
  timerProgressBar: true
})
```

**User Feedback Best Practices:**
- Use SweetAlert2 for notifications
- Position notifications at `bottom-end`
- Keep notifications brief (2000ms timer)
- Use custom classes for consistent sizing
- Enable `timerProgressBar` for visibility
- Provide messages in Portuguese
- Choose appropriate icons: `success`, `error`, `warning`, `info`

### Type Definitions
```typescript
export interface IStudent {
  _id?: string;
  name: { fullName: string; surname?: string };
  birthDate: Date;
  gender: 'masculino' | 'feminino' | string;
  // ... other fields
  status: 'active' | 'inactive';
}

export type PaymentStatus = 'overdue' | 'paid' | 'pending' | 'cancelled' | string
```

**Type Definition Best Practices:**
- Use `interface` for object shapes
- Use `type` for unions and primitives
- Export all interfaces and types
- Use string literals for known values with `| string` fallback
- Mark optional fields with `?`
- Use `Date` type for dates (converted from strings by services)
- Prefix interfaces with `I`

### Styling with Tailwind
- Use Tailwind utility classes directly in JSX
- Keep classes readable with proper formatting
- Use Tailwind plugins:
  - `@tailwindcss/forms`
  - `@tailwindcss/typography`
  - `@tailwindcss/aspect-ratio`
- Follow mobile-first responsive design

### Electron Integration
- Main process in `src/main/`
- Preload scripts in `src/preload/`
- Use IPC for main-renderer communication
- Handle app lifecycle events properly

## Syntax and Structure
- **Asynchronous Code:** Always use `async/await`
- **Null vs Undefined:** Use `undefined` for optional/missing values; use `null` only when API returns it
- **Functions:** Prefer arrow functions for component methods
- **Variable Declaration:** Use `const` by default, `let` when reassignment needed
- **Strings:** Use template literals for interpolation, single quotes otherwise
- **Semicolons:** Always use semicolons
- **Imports:** Group imports: React, third-party, local (components, services, utils)

## Anti-Patterns to Avoid
- ❌ Do not use class components - use functional components only
- ❌ Do not use `any` type without explicit justification
- ❌ Do not call hooks conditionally or inside loops
- ❌ Do not mutate state directly - use setter functions
- ❌ Do not forget to clean up effects with return functions
- ❌ Do not use `console.log` in production code
- ❌ Do not make API calls directly in components - use services
- ❌ Do not forget to handle loading and error states
- ❌ Do not bypass TypeScript with type assertions unnecessarily
- ❌ Do not forget to type component props
- ❌ Do not use default exports for components - use named exports
- Do not forget to write user-facing messages in Portuguese and putting loader indicators where necessary

## State Management Strategy
1. **Local State:** Use `useState` for component-specific state
2. **Server State:** Use React Query for API data (queries and mutations)
3. **Global State:** Use Context for app-wide state (auth, center, school year)
4. **Form State:** Use React Hook Form for form management
5. **Session Storage:** Use for persistence across app restarts

## API Integration
- Base URL configured in `my-env.ts`
- Axios instance with credentials: `withCredentials: true`
- Authentication via HTTP-only cookies
- All requests go through service layer

## PDF Reports
- Use `@react-pdf/renderer` for PDF generation
- Define report components in `reports/` directory
- Follow PDF-specific styling constraints
- Include center branding in reports

## React Query Configuration
```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  }
})
```

## Common Patterns

### Protected Routes
```tsx
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signed } = useAuth()
  return signed ? children : <Navigate to="/login" />
}
```

### Pagination
- Use `Pagination` component from `components/Pagination`
- Track current page in component state
- Pass page to React Query hooks
- Update page on user interaction

### Search
- Use debounced search with `use-debounce` library
- Trigger search queries when debounced value changes
- Clear results when search is empty

### Date Handling
- Use `date-fns` for date operations
- Display dates in appropriate formats for Portuguese locale
- Handle timezone considerations

## Testing & Quality
- No test framework currently configured
- Manual testing via Electron app
- Use Chrome DevTools for debugging renderer process
- Check Console for errors and warnings

## Build & Distribution
- Development: `yarn dev`
- Build: `yarn build`
- Platform-specific builds:
  - Windows: `yarn build:win`
  - macOS: `yarn build:mac`
  - Linux: `yarn build:linux`

## Accessibility
- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation works
- Use appropriate ARIA labels when needed
- Test with screen readers

## Performance Considerations
- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback`
- Use React Query's caching for data
- Lazy load routes if bundle size grows
- Optimize images and assets
