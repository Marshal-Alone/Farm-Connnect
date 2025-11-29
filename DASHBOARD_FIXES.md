# Dashboard Fixes - Manual Instructions

## Issue 1: Delete Button Not Working (No Confirmation Dialog)

The `window.confirm()` function is being blocked by your browser. We need to add a custom confirmation dialog.

### Step 1: Add Delete Confirmation State

Find this line (around line 37):
```tsx
const ownerId = 'user123'; // Demo owner ID
```

Add this AFTER it:
```tsx
// Delete confirmation dialog state
const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
  open: false,
  id: '',
  name: ''
});
```

### Step 2: Update Delete Handler

Find the `handleDeleteMachinery` function (around line 187) and replace it with:
```tsx
const handleDeleteMachinery = (machineryId: string, machineryName: string) => {
  // Show custom delete dialog
  setDeleteDialog({ open: true, id: machineryId, name: machineryName });
};
```

### Step 3: Add Confirm Delete Function

Add this NEW function after `handleDeleteMachinery`:
```tsx
const confirmDeleteMachinery = async () => {
  const { id, name } = deleteDialog;
  console.log('Deleting machinery:', id, name);

  try {
    const response = await machineryService.deleteMachinery(id);
    console.log('Delete response:', response);
    
    if (response.success) {
      toast({ title: "Machinery Deleted", description: `${name} has been deleted successfully` });
      fetchDashboardData();
    } else {
      toast({ title: "Error", description: response.error || "Failed to delete machinery", variant: "destructive" });
    }
  } catch (error) {
    console.error('Delete error:', error);
    toast({ title: "Error", description: "Failed to delete machinery", variant: "destructive" });
  } finally {
    setDeleteDialog({ open: false, id: '', name: '' });
  }
};
```

### Step 4: Add Delete Confirmation Dialog UI

Find the VERY END of the component, just BEFORE the final closing tags `</div></div>` (around line 905), and add this:

```tsx
        {/* Delete Confirmation Dialog */}
        {deleteDialog.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Confirm Delete</CardTitle>
                <CardDescription>
                  Are you sure you want to delete "{deleteDialog.name}"? This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: '', name: '' })}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteMachinery}>
                  Delete
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
```

---

## Issue 2: Edit Button - Add Edit Mode to Detail Page

The edit button currently goes to the machinery detail page which is read-only. We'll add edit functionality to that page later. For now, the edit button will take you to the detail page where you can view all the information.

**Future Enhancement**: We can add an "Edit Mode" toggle on the detail page that allows inline editing of machinery details.

---

## Testing

After making these changes:

1. **Refresh your browser** (Ctrl + Shift + R)
2. **Go to Profile → Dashboard tab**
3. **Click Delete** on a machinery item
   - You should now see a nice modal dialog asking for confirmation
   - Click "Delete" to confirm or "Cancel" to cancel
4. **Check the console** (F12) to see the delete logs

The delete functionality should now work perfectly with a proper confirmation dialog!
