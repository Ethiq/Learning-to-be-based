import { clsx } from 'clsx'

export function cn(...inputs: Array<string | undefined | false | null>) {
  return clsx(inputs)
}

export function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function isAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value)
}
