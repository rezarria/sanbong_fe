import { Struct, StructFlatedType, RouterItems, MenuItem } from "./type";

export function flat(
  structs?: Struct[],
  previous?: StructFlatedType,
): StructFlatedType[] {
  if (structs == null || structs.length === 0) return [];
  const data: StructFlatedType[] = [];
  structs.forEach((struct) => {
    const item: StructFlatedType = { data: struct, previous };
    data.push(item);
    if (struct.children != null && struct.children.length != 0) {
      const children = structFillter(struct.children);
      data.push(...flat(children, item));
    }
  });
  return data;
}

export function structFillter(list: RouterItems[]) {
  return list.filter((i) => !("type" in i)) as Struct[];
}

export function find(
  paths: string[],
  routerItems: RouterItems[],
): Struct | undefined {
  const list = structFillter(routerItems);
  let cursor = list.find((i) => i.name == paths[0]);
  if (cursor == null) return;
  const _paths = paths.slice(1);
  for (const key of _paths) {
    if (cursor.children == null) return;
    cursor = structFillter(cursor.children).find((i) => i.name == key);
    if (cursor == null) return;
  }
  return cursor;
}

export function queryByName(paths: string[], structFlated: StructFlatedType[]) {
  const results: Struct[] = [];
  paths.forEach((path) => {
    const struct = structFlated.find((i) => i.data.name == path);
    if (struct != null) results.push(struct.data);
  });
  return results.toReversed();
}

export function query2(
  url: string,
  structFlated: StructFlatedType[],
): Struct[] | undefined {
  const item = structFlated.find((i) => i.data.src == url);
  if (item == null) return undefined;
  const result = [item.data];
  let cursor = item;
  while (cursor.previous != null) {
    cursor = cursor.previous;
    result.push(cursor.data);
  }
  return result.toReversed();
}

export function query(
  url: string,
  routerItems: RouterItems[],
): Struct[] | undefined {
  let arr = structFillter(routerItems);
  const results: Struct[] = [];
  let length = url.length;
  while (true) {
    if (length == 0) break;
    const result = arr.find((i) => (i.src ? url.startsWith(i.src) : false));
    if (result == null || result.src == null) return;
    results.push(result);
    length -= result.src.length;
    if (length != 0) {
      if (result.children == null || result.children.length == 0)
        throw new Error("");
      arr = structFillter(result.children);
    } else {
      return results;
    }
  }
}

export function convertItem(item: RouterItems) {
  if ("type" in item) {
    return { type: item.type } as MenuItem;
  } else {
    return {
      icon: item.icon,
      label: item.title,
      key: item.name,
      children: item.children ? convertItems(item.children) : undefined,
    } as MenuItem;
  }
}

export function convertItems(items: RouterItems[]): MenuItem[] {
  return items.map((item) => convertItem(item));
}
