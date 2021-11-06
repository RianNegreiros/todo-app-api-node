import { container } from 'tsyringe'
import { DateProvider } from './DateProvider'
import { IDateProvider } from './IDateProvider'

container.registerSingleton<IDateProvider>('DateProvider', DateProvider)
