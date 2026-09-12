"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MainlandWarning() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/cdn-cgi/trace", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.text() : "")
      .then((trace) => {
        const country = /^loc=([^\r\n]+)$/m.exec(trace)?.[1]?.trim();
        if (country === "CN") setOpen(true);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="mainland-warning" showCloseButton={false}>
        <DialogHeader>
          <span className="mainland-warning__eyebrow">REGION NOTICE</span>
          <DialogTitle>Mainland China access notice</DialogTitle>
          <DialogDescription>
            This site is not recommended for use in mainland China. Network conditions may prevent some images, live data, or external links from loading correctly.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <button className="mainland-warning__continue" type="button">CONTINUE ANYWAY</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}