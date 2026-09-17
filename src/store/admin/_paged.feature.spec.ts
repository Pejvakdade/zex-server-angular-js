import { TestBed } from '@angular/core/testing';
import { signalStore } from '@ngrx/signals';
import { of, throwError } from 'rxjs';

import { ApiService } from '@src/lib/api.service';

import { emptyPage, withPaged } from './_paged.feature';

type Row = { _id: string; name: string };
type Filters = { status: string | null; search: string | null };

const Store = signalStore(withPaged<Row, Filters>('ticket', { status: null, search: null }, 10));

describe('withPaged', () => {
  const api = { get: vi.fn() };
  let store: InstanceType<typeof Store>;

  beforeEach(() => {
    api.get.mockReset();
    TestBed.configureTestingModule({ providers: [Store, { provide: ApiService, useValue: api }] });
    store = TestBed.inject(Store);
  });

  it('starts with an empty page and no filters applied', () => {
    expect(store.page()).toEqual(emptyPage());
    expect(store.filters()).toEqual({ status: null, search: null });
  });

  it('serialises page, limit and only the non-blank filters into the query string', async () => {
    api.get.mockReturnValue(of({ ...emptyPage<Row>(), page: 2 }));
    store.setFilter('status', 'Open');
    store.setFilter('search', '   ');

    await store.load(2);

    expect(api.get).toHaveBeenCalledWith('ticket?page=2&limit=10&status=Open');
    expect(store.page().page).toBe(2);
    expect(store.loading()).toBe(false);
  });

  it('records the backend error message and clears loading', async () => {
    api.get.mockReturnValue(throwError(() => ({ error: { message: 'Nope' } })));

    await store.load();

    expect(store.error()).toBe('Nope');
    expect(store.loading()).toBe(false);
    store.clearError();
    expect(store.error()).toBeNull();
  });

  it('write() runs the request, reloads the current page and reports success', async () => {
    api.get.mockReturnValue(of({ ...emptyPage<Row>(), page: 3 }));
    await store.load(3);
    api.get.mockClear();

    const ok = await store.write(async () => undefined);

    expect(ok).toBe(true);
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('page=3'));
    expect(store.saving()).toBe(false);
  });

  it('write() surfaces a failure without reloading', async () => {
    const ok = await store.write(async () => {
      throw { error: { message: ['Subject is required'] } };
    });

    expect(ok).toBe(false);
    expect(store.error()).toBe('Subject is required');
    expect(api.get).not.toHaveBeenCalled();
  });
});
