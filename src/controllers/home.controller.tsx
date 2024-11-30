import { RouteObject } from 'react-router-dom'
import { HomeView } from '../views/home.view'
import { TaskModel } from '../models/task.model'

export const HomeController: RouteObject = {
    path: '/',
    element: <HomeView taskModel={new TaskModel()}/>
}