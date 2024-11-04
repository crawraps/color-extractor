import { RouteRecordRaw } from "vue-router"

export type RouteMeta = {
  title: string
}

export type Route = RouteRecordRaw & {
  meta?: RouteMeta
}
